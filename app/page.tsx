'use client';

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionManager from '@/components/SubscriptionManager';
import { getAuth } from 'firebase/auth';
import { getUserUsage } from '@/firebase/usage';
import Link from 'next/link';

interface PredictionResponse {
  id: string;
  status: string;
  output: string | null;
  error: string | null;
  urls: {
    get: string;
    cancel: string;
  };
}

export default function Home() {
  const [portraitImage, setPortraitImage] = useState<File | null>(null);
  const [drivingVideo, setDrivingVideo] = useState<File | null>(null);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [showSubscription, setShowSubscription] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // 使用身份验证钩子
  const {
    user,
    loading: authLoading,
    canGenerate,
    remainingAnimations,
    subscriptionExpired,
    error: authError,
    updateUsageAfterGeneration
  } = useAuth();

  const formRef = useRef<HTMLFormElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLElement>(null);

  // 处理身份验证错误
  useEffect(() => {
    if (authError) {
      setError(`Authentication error: ${authError}`);
    }
  }, [authError]);

  // 添加星空效果
  useEffect(() => {
    // 创建星星背景
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    // 随机生成100颗星星
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      starsContainer.appendChild(star);
    }

    return () => {
      // 组件卸载时清理
      document.body.removeChild(starsContainer);
    };
  }, []);

  // 滚动到上传部分的函数
  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Handle file uploads
  const handlePortraitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        setError('Portrait must be a JPG or PNG image');
        return;
      }
      setPortraitImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPortraitPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      setError(null);
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type !== 'video/mp4') {
        setError('Driving video must be an MP4 file');
        return;
      }
      setDrivingVideo(file);

      // Create video preview
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);

      setError(null);
    }
  };

  // Process form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 检查用户是否登录
    if (!user) {
      setError('You must be logged in to generate animations');
      return;
    }

    // 检查用户是否可以在本周内生成动画
    if (!canGenerate) {
      // 获取用户当前计划信息
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        // 检查是否为付费用户
        const usageData = await getUserUsage(user.uid);

        if (usageData?.isProUser) {
          setError("You've used all your animations for this billing period. Please upgrade your plan or wait for the next billing cycle.");
        } else {
          setError("You've used your free animation for this week. Upgrade to Basic or Pro for more animations.");
        }
      } else {
        setError("You've reached your animation limit. Please try again later.");
      }
      return;
    }

    if (!portraitImage || !drivingVideo) {
      setError('Please upload both a portrait image and a driving video');
      return;
    }

    // 检查文件大小限制
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 限制
    if (portraitImage.size > MAX_FILE_SIZE) {
      setError(`Portrait image is too large. Maximum size is 5MB, your file is ${(portraitImage.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    if (drivingVideo.size > MAX_FILE_SIZE) {
      setError(`Driving video is too large. Maximum size is 5MB, your file is ${(drivingVideo.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress('Preparing files...');
      setVideoResult(null);

      // Convert files to base64
      const portraitBase64 = await fileToBase64(portraitImage);
      const videoBase64 = await fileToBase64(drivingVideo);

      setProgress('Sending to AI model...');

      // Use a proxy API route instead of calling Replicate directly
      const response = await fetch('/api/generate-animation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: portraitBase64,
          video: videoBase64
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // 显示详细错误信息
        let errorMessage = `API request failed: ${response.statusText}`;
        if (responseData.error) {
          errorMessage = responseData.error;
        }

        throw new Error(errorMessage);
      }

      const prediction = responseData;

      // Poll for results
      setProgress('Processing your video...');
      const result = await pollPrediction(prediction.id);

      if (result.output) {
        setVideoResult(result.output);
        setProgress('');

        // 更新用户使用记录
        await updateUsageAfterGeneration();
      } else if (result.error) {
        throw new Error(result.error);
      }

    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  // Poll prediction until complete
  const pollPrediction = async (id: string): Promise<PredictionResponse> => {
    const response = await fetch(`/api/check-prediction?id=${id}`);

    if (!response.ok) {
      throw new Error(`Polling failed: ${response.statusText}`);
    }

    const prediction: PredictionResponse = await response.json();

    if (prediction.status === 'succeeded') {
      return prediction;
    } else if (prediction.status === 'failed') {
      throw new Error(prediction.error || 'Processing failed');
    }

    // Continue polling
    setProgress(`Processing (status: ${prediction.status})...`);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
    return pollPrediction(id);
  };

  // Custom file upload trigger
  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };

  const toggleSubscription = () => {
    setShowSubscription(!showSubscription);
  };

  const toggleFeedbackForm = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };

  // 显示加载指示器
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <svg className="loading-spinner mx-auto" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      <div className="blob blob-5"></div>

      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 font-space-grotesk">FaceMojo</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#upload" className="text-slate-300 hover:text-white transition-colors text-sm">Try Now</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors text-sm">How It Works</a>
            <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm">Features</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors text-sm">Pricing</a>
            <a href="#faq" className="text-slate-300 hover:text-white transition-colors text-sm">FAQ</a>
          </nav>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSubscription}
              className="btn-secondary text-sm py-2 px-4 flex items-center"
            >
              {user ? (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span>{remainingAnimations} Credits</span>
                </>
              ) : 'Sign In'}
            </button>

            {user && (
              <button
                onClick={() => {
                  // 创建一个注销函数，调用 Firebase Auth 的 signOut 方法
                  if (window.confirm('Are you sure you want to sign out?')) {
                    const auth = getAuth();
                    auth.signOut();
                  }
                }}
                className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                title="Sign Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content wrapper with top padding for header */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-10 md:py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Text Content */}
              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in font-space-grotesk">
                  Turn Any Photo into a <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Talking Avatar</span> with AI
                </h1>
                <p className="text-base md:text-lg text-slate-300 mb-6 animate-fade-in delay-100">
                  Upload a portrait and animate it instantly with state-of-the-art motion transfer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8 md:mb-0 animate-fade-in delay-200">
                  <button onClick={scrollToUpload} className="btn hover:scale-105 transition-transform duration-300 group">
                    Try Free
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/50 to-blue-600/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                  <button onClick={toggleSubscription} className="btn-secondary hover:scale-105 transition-transform duration-300">View Plans</button>
                </div>
              </div>
              
              {/* Demo Animation */}
              <div className="md:w-1/2 animate-fade-in delay-300">
                <div className="rounded-xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-700/50">
                  <img
                    src="/demo-preview.gif"
                    alt="FaceMojo AI Avatar Animation"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section ref={uploadSectionRef} id="upload" className="py-16 px-4 bg-gradient-to-b from-slate-900/70 to-slate-800/70 backdrop-blur-sm">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="section-title">Try It Now</h2>
              <p className="section-subtitle">Upload your photo and start animating</p>
            </div>

            <div className="glass-card border border-slate-700/50 shadow-xl">
              <form ref={formRef} onSubmit={handleSubmit} className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Portrait Upload */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 font-space-grotesk flex items-center">
                      <span className="w-8 h-8 bg-blue-500/20 rounded-full inline-flex items-center justify-center mr-2 text-blue-400">1</span>
                      Portrait Photo
                    </h3>
                    <div
                      className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-800/30 hover:bg-slate-800/50"
                      onClick={() => triggerFileInput(portraitInputRef)}
                    >
                      {portraitPreview ? (
                        <div className="relative w-full h-64">
                          <Image
                            src={portraitPreview}
                            alt="Portrait preview"
                            fill
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto w-16 h-16 mb-4 bg-slate-800/60 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-slate-300">Click to upload portrait photo<br />(JPG or PNG format)</p>
                        </>
                      )}
                      <input
                        ref={portraitInputRef}
                        type="file"
                        onChange={handlePortraitChange}
                        accept="image/jpeg,image/png"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Driving Video Upload */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 font-space-grotesk flex items-center">
                      <span className="w-8 h-8 bg-indigo-500/20 rounded-full inline-flex items-center justify-center mr-2 text-indigo-400">2</span>
                      Driving Video
                    </h3>
                    <div
                      className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-800/30 hover:bg-slate-800/50"
                      onClick={() => triggerFileInput(videoInputRef)}
                    >
                      {videoPreview ? (
                        <div className="w-full">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full h-64 object-contain"
                          ></video>
                        </div>
                      ) : (
                        <>
                          <div className="mx-auto w-16 h-16 mb-4 bg-slate-800/60 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-slate-300">Click to upload driving video<br />(MP4 format)</p>
                        </>
                      )}
                      <input
                        ref={videoInputRef}
                        type="file"
                        onChange={handleVideoChange}
                        accept="video/mp4"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 text-center">
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !portraitImage || !drivingVideo || !user || !canGenerate}
                    className={`btn px-10 py-3 relative overflow-hidden group ${(loading || !portraitImage || !drivingVideo || !user || !canGenerate) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform duration-300'}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {progress || 'Processing...'}
                      </>
                    ) : (
                      <>
                        Generate Animation
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/50 to-blue-600/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </>
                    )}
                  </button>
                  <div className="mt-4 bg-slate-800/30 rounded-lg p-3 inline-block">
                    {!user ? (
                      <p className="text-amber-400 text-sm">Please sign in to continue</p>
                    ) : !canGenerate ? (
                      <p className="text-amber-400 text-sm">
                        You've reached your animation limit.
                        <button
                          onClick={toggleSubscription}
                          className="ml-1 text-blue-400 hover:text-blue-300 underline"
                        >
                          Upgrade plan
                        </button>
                      </p>
                    ) : (
                      <p className="text-slate-300 text-sm flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        You have <span className="text-white font-medium mx-1">{remainingAnimations}</span> animations remaining
                      </p>
                    )}
                  </div>
                </div>
              </form>

              {/* Results Display */}
              {videoResult && (
                <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
                  <h3 className="text-xl font-bold mb-6 text-center font-space-grotesk">Your Animation Result</h3>
                  <div className="max-w-2xl mx-auto">
                    <video
                      src={videoResult}
                      controls
                      autoPlay
                      loop
                      className="w-full rounded-lg shadow-2xl"
                    ></video>
                    <div className="mt-6 flex justify-center">
                      <a
                        href={videoResult}
                        download="facemojo-animation.mp4"
                        className="btn-secondary hover:scale-105 transition-transform duration-300"
                      >
                        Download Video
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 px-4">
          <div className="container mx-auto text-center max-w-5xl">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle max-w-2xl mx-auto">Create animated videos in three simple steps</p>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="glass-card animate-fade-in hover:bg-white/10 transition-colors duration-300 border border-slate-700/50">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 font-space-grotesk">1. Upload</h3>
                <p className="text-slate-300 text-sm">Upload your portrait photo and select a driving video</p>
              </div>

              <div className="glass-card animate-fade-in delay-100 hover:bg-white/10 transition-colors duration-300 border border-slate-700/50">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 font-space-grotesk">2. Animate</h3>
                <p className="text-slate-300 text-sm">Our AI processes your image and applies motion transfer</p>
              </div>

              <div className="glass-card animate-fade-in delay-200 hover:bg-white/10 transition-colors duration-300 border border-slate-700/50">
                <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 font-space-grotesk">3. Download</h3>
                <p className="text-slate-300 text-sm">Download your animated video in high quality MP4 format</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-gradient-to-b from-slate-900/70 to-slate-800/70">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="section-title">Powerful Features</h2>
              <p className="section-subtitle max-w-2xl mx-auto">Everything you need to create stunning animated avatars</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="card animate-fade-in p-5 hover:translate-y-[-5px] transition-transform duration-300 border border-slate-700/50">
                <div className="text-blue-400 mb-3 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-center font-space-grotesk">Instant Results</h3>
                <p className="text-slate-300 text-sm text-center">No training required. Get your animated avatar in seconds.</p>
              </div>

              <div className="card animate-fade-in delay-100 p-5 hover:translate-y-[-5px] transition-transform duration-300 border border-slate-700/50">
                <div className="text-indigo-400 mb-3 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-center font-space-grotesk">Human-Grade Lip Sync</h3>
                <p className="text-slate-300 text-sm text-center">Precise lip synchronization for natural-looking speech.</p>
              </div>

              <div className="card animate-fade-in delay-200 p-5 hover:translate-y-[-5px] transition-transform duration-300 border border-slate-700/50">
                <div className="text-purple-400 mb-3 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-center font-space-grotesk">High-Quality Export</h3>
                <p className="text-slate-300 text-sm text-center">Download videos in HD or 4K quality depending on your plan.</p>
              </div>

              <div className="card animate-fade-in delay-300 p-5 hover:translate-y-[-5px] transition-transform duration-300 border border-slate-700/50">
                <div className="text-green-400 mb-3 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-center font-space-grotesk">Privacy First</h3>
                <p className="text-slate-300 text-sm text-center">Your photos and videos are processed securely and never shared.</p>
              </div>

              <div className="card animate-fade-in delay-400 p-5 hover:translate-y-[-5px] transition-transform duration-300 border border-slate-700/50">
                <div className="text-orange-400 mb-3 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-center font-space-grotesk">No Watermark</h3>
                <p className="text-slate-300 text-sm text-center">Pro and Basic plans come with watermark-free exports.</p>
              </div>

              <div className="card animate-fade-in delay-500 p-5 hover:translate-y-[-5px] transition-transform duration-300 border border-slate-700/50">
                <div className="text-pink-400 mb-3 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-center font-space-grotesk">Professional Results</h3>
                <p className="text-slate-300 text-sm text-center">Created using state-of-the-art AI models for photorealistic animations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="section-title">Simple Pricing</h2>
              <p className="section-subtitle max-w-2xl mx-auto">Choose the plan that works for you</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card animate-fade-in p-6 border border-slate-700/50 hover:border-slate-600/70 transition-colors duration-300 hover:bg-slate-800/50">
                <h3 className="text-2xl font-bold mb-2 font-space-grotesk">Free</h3>
                <div className="text-3xl font-bold mb-4">$0</div>
                <ul className="space-y-2 mb-6 text-left text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>1 animation per week</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Standard quality</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic support</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <svg className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Watermarked output</span>
                  </li>
                </ul>
                <button
                  onClick={scrollToUpload}
                  className="w-full btn-secondary hover:scale-105 transition-transform duration-300"
                >
                  Try Now
                </button>
              </div>

              <div className="card animate-fade-in delay-100 p-6 border border-purple-500/50 relative hover:border-purple-400/70 transition-colors duration-300 hover:bg-slate-800/50 transform hover:scale-105 shadow-lg shadow-purple-900/10">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-max px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-full">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold mb-2 font-space-grotesk">Basic</h3>
                <div className="text-3xl font-bold mb-4">$5.00<span className="text-base text-slate-400">/month</span></div>
                <ul className="space-y-2 mb-6 text-left text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>10 animations per month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Higher quality</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Download in HD</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No watermark</span>
                  </li>
                </ul>
                <button onClick={toggleSubscription} className="w-full btn relative group hover:scale-105 transition-transform duration-300">
                  Subscribe Now
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/50 to-blue-600/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>

              <div className="card animate-fade-in delay-200 p-6 border border-slate-700/50 hover:border-slate-600/70 transition-colors duration-300 hover:bg-slate-800/50">
                <h3 className="text-2xl font-bold mb-2 font-space-grotesk">Pro</h3>
                <div className="text-3xl font-bold mb-4">$15.00<span className="text-base text-slate-400">/month</span></div>
                <ul className="space-y-2 mb-6 text-left text-sm">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>50 animations per month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Highest quality</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Download in 4K</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No watermark</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced customization</span>
                  </li>
                </ul>
                <button onClick={toggleSubscription} className="w-full btn hover:scale-105 transition-transform duration-300">
                  Go Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 px-4 bg-gradient-to-b from-slate-900/70 to-slate-800/70">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle max-w-2xl mx-auto">Everything you need to know about FaceMojo</p>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-5 hover:bg-white/5 transition-colors duration-300 border border-slate-700/50">
                <h3 className="text-lg font-bold mb-2 font-space-grotesk">What is FaceMojo?</h3>
                <p className="text-slate-300 text-sm">FaceMojo is an AI-powered tool that lets you animate portrait photos by transferring motion from a driving video. It creates realistic talking avatars without any training required.</p>
              </div>

              <div className="glass-card p-5 hover:bg-white/5 transition-colors duration-300 border border-slate-700/50">
                <h3 className="text-lg font-bold mb-2 font-space-grotesk">How many animations can I create?</h3>
                <p className="text-slate-300 text-sm">Free users get 1 animation per week. Basic subscribers get 10 animations per month, and Pro users get 50 animations per month.</p>
              </div>

              <div className="glass-card p-5 hover:bg-white/5 transition-colors duration-300 border border-slate-700/50">
                <h3 className="text-lg font-bold mb-2 font-space-grotesk">Can I use the animations for commercial purposes?</h3>
                <p className="text-slate-300 text-sm">Yes, Basic and Pro subscribers can use their animations for commercial purposes. Free users are limited to personal use only.</p>
              </div>

              <div className="glass-card p-5 hover:bg-white/5 transition-colors duration-300 border border-slate-700/50">
                <h3 className="text-lg font-bold mb-2 font-space-grotesk">What file formats are supported?</h3>
                <p className="text-slate-300 text-sm">We support JPG and PNG for portrait images. For driving videos, we support MP4 format.</p>
              </div>

              <div className="glass-card p-5 hover:bg-white/5 transition-colors duration-300 border border-slate-700/50">
                <h3 className="text-lg font-bold mb-2 font-space-grotesk">Is my data secure?</h3>
                <p className="text-slate-300 text-sm">Yes, we take privacy seriously. Your uploaded images and videos are processed securely and never shared with third parties. Files are automatically deleted after processing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="fixed bottom-10 right-10 z-40">
          {showFeedbackForm ? (
            <div className="glass-card border border-slate-700/50 overflow-hidden rounded-xl shadow-2xl w-[90vw] max-w-2xl relative animate-fade-in">
              <div className="flex justify-between items-center p-4 border-b border-slate-700/50 bg-slate-800/70">
                <h2 className="text-xl font-bold font-space-grotesk">Help Us Improve FaceMojo</h2>
                <button
                  onClick={toggleFeedbackForm}
                  className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                  aria-label="Close feedback form"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSermFAkp6UU0Us3cD464W4KyrQmX-LRpwMwf65TC_KZ-F2LJA/viewform?usp=dialog"
                className="w-full h-[500px] border-0"
                title="Feedback Form"
              ></iframe>
            </div>
          ) : (
            <button
              onClick={toggleFeedbackForm}
              className="glass-card p-4 rounded-full shadow-lg hover:shadow-purple-500/20 hover:bg-white/10 transition-all duration-300 group"
              aria-label="Open feedback form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
          )}
        </section>

        {/* Footer */}
        <footer className="py-10 px-4 border-t border-slate-800">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 font-space-grotesk">FaceMojo</h2>
                <p className="text-sm text-slate-400 mt-2">© 2025 FaceMojo. All rights reserved.</p>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">Site</h3>
                  <ul className="space-y-2">
                    <li><Link href="/" className="text-slate-300 hover:text-white transition-colors text-sm">Home</Link></li>
                    <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors text-sm">About Us</Link></li>
                    <li><Link href="/terms" className="text-slate-300 hover:text-white transition-colors text-sm">Terms & Privacy</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">Connect</h3>
                  <ul className="space-y-2">
                    <li><Link href="/contact" className="text-slate-300 hover:text-white transition-colors text-sm">Contact Us</Link></li>
                    <li><a href="mailto:support@facemojo.ai" className="text-slate-300 hover:text-white transition-colors text-sm">support@facemojo.ai</a></li>
                    <li><a href="https://twitter.com/facemojo" className="text-slate-300 hover:text-white transition-colors text-sm">Twitter</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
              <p>Not affiliated with TikTok, ByteDance, or any other social media platform.</p>
              <p className="mt-2">Powered by AI models from Replicate.</p>
            </div>
          </div>
        </footer>

        {/* Subscription Modal */}
        {showSubscription && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full">
              <SubscriptionManager onClose={toggleSubscription} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 