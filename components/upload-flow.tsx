"use client"

import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { motion } from "framer-motion"
import { Upload, ImageIcon, Video, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useRef } from "react"
import { saveAnimationToFirestore } from "@/lib/saveAnimationToFirestore"
import { handleAnimationGeneration } from "@/lib/handleGeneration"
import { getAuth } from "firebase/auth"


export function UploadFlow() {
  const [hasUsedFree, setHasUsedFree] = useState<boolean | null>(null)
  const [isProUser, setIsProUser] = useState(false)
  const [animationsLeft, setAnimationsLeft] = useState<number | null>(null)

  // 检查 localStorage 中是否存储了订阅状态
  useEffect(() => {
    try {
      const plan = localStorage.getItem("userPlan");
      if (plan === "pro" || plan === "basic") {
        setIsProUser(true);
      }
    } catch (e) {
      console.warn("localStorage not available", e);
    }
  }, []);
  useEffect(() => {
    const fetchAnimationsLeft = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const subRef = doc(db, "userSubscriptions", user.uid);
      const subSnap = await getDoc(subRef);
      if (subSnap.exists()) {
        const data = subSnap.data();
        if (typeof data.animationsLeft === "number") {
          setAnimationsLeft(data.animationsLeft);
        }
      }
    };

    fetchAnimationsLeft();
  }, []);
  useEffect(() => {
    const checkUsage = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const usageRef = doc(db, "usageStats", user.uid);
      const usageSnap = await getDoc(usageRef);
      setHasUsedFree(usageSnap.exists());
    };

    checkUsage();
  }, []);

  const checkIfUserHasUsedFree = async () => {
    const user = auth.currentUser;
    if (!user) return false;

    const usageRef = doc(db, "usageStats", user.uid); // ✅
    const usageSnap = await getDoc(usageRef);

    return usageSnap.exists(); // 如果已存在，就说明用过免费机会了
  };

  const recordFreeUsage = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const usageRef = doc(db, "usageStats", user.uid);
    await setDoc(usageRef, {
      used: true,
      timestamp: new Date(),
    });
  };
  const [activeStep, setActiveStep] = useState(1)
  const [photoHover, setPhotoHover] = useState(false)
  const [videoHover, setVideoHover] = useState(false)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoSelected, setPhotoSelected] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoMessage, setVideoMessage] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeMB = 20;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert("❌ File is too large. Max size is 20MB.");
      return;
    }

    setIsUploadingVideo(true); // ✅ 开始上传中

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > 15) {
        alert("❌ Video is too long. Max duration is 15 seconds.");
        setIsUploadingVideo(false);
      } else {
        const user = auth.currentUser;
        if (!user) {
          alert("User not authenticated.");
          setIsUploadingVideo(false);
          return;
        }

        const usageRef = doc(db, "usageStats", user.uid);
        const usageSnap = await getDoc(usageRef);

        if (usageSnap.exists()) {
          alert("❌ You’ve already used your free animation. Please upgrade to continue.");
          setIsUploadingVideo(false);
          return;
        } else {
          await setDoc(usageRef, {
            used: true,
            timestamp: new Date(),
          });

          setVideoPreviewUrl(videoUrl);
          setVideoMessage("✅ This is your 1 free generation. Enjoy!");
          setIsUploadingVideo(false); // ✅ 上传完成
        }
      }
    };

    video.src = videoUrl;
  };

  return (
    <section id="upload-flow" className="py-20 md:py-28 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
              Create Your Animation
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our advanced AI technology makes it simple to bring your photos to life in just three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card
                className={`p-8 h-full flex flex-col items-center text-center cursor-pointer border-2 bg-gray-900/80 backdrop-blur-sm ${activeStep === 1 ? "border-purple-500" : "border-gray-800"
                  } hover:border-purple-500 transition-all duration-300`}
                onClick={() => setActiveStep(1)}
              >
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center mb-6 relative"
                    onMouseEnter={() => setPhotoHover(true)}
                    onMouseLeave={() => setPhotoHover(false)}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-purple-600/50 blur-md"></div>

                    <motion.div
                      animate={{
                        scale: photoHover ? 1.1 : 1,
                        rotate: photoHover ? 10 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <ImageIcon className="h-10 w-10 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Step 1</h3>
                  <p className="text-gray-300 mb-4">Upload Portrait Photo</p>

                  {/* Preview image */}
                  <div className="relative w-full h-32 mb-6 rounded-lg overflow-hidden border border-gray-700">
                    <Image
                      src={photoPreviewUrl || "/images/portrait-placeholder.png"}
                      alt="Portrait preview"
                      fill
                      className="object-contain bg-black"
                    />
                    {!photoPreviewUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <p className="text-white text-sm font-medium">Your portrait here</p>
                      </div>
                    )}
                  </div>
                  {photoSelected && (
                    <p className="text-green-400 text-sm -mt-4 mb-2">✅ Photo selected!</p>
                  )}
                </div>

                <Button
                  onClick={() => photoInputRef.current?.click()}
                  variant={activeStep === 1 ? "default" : "outline"}
                  className={
                    activeStep === 1
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border-0 text-white"
                      : "border-purple-500/50 text-purple-400 hover:text-white hover:bg-purple-950/50"
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Photo
                </Button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPhotoPreviewUrl(URL.createObjectURL(file));
                      setPhotoSelected(true);
                    }
                  }}
                  className="hidden"
                />
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card
                className={`p-8 h-full flex flex-col items-center text-center cursor-pointer border-2 bg-gray-900/80 backdrop-blur-sm ${activeStep === 2 ? "border-cyan-500" : "border-gray-800"
                  } hover:border-cyan-500 transition-all duration-300`}
                onClick={() => setActiveStep(2)}
              >
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-900 to-cyan-700 flex items-center justify-center mb-6 relative"
                    onMouseEnter={() => setVideoHover(true)}
                    onMouseLeave={() => setVideoHover(false)}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-cyan-600/50 blur-md"></div>

                    <motion.div
                      animate={{
                        scale: videoHover ? 1.1 : 1,
                        rotate: videoHover ? -10 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <Video className="h-10 w-10 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Step 2</h3>
                  <p className="text-gray-300 mb-4">Upload Driving Video</p>

                  {/* Preview video thumbnail */}
                  <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden border border-gray-700 bg-black">
                    {isUploadingVideo ? (
                      <div className="w-full h-full flex items-center justify-center text-purple-400 text-sm">
                        ⏳ Uploading video...
                      </div>
                    ) : videoPreviewUrl ? (
                      <video
                        src={videoPreviewUrl}
                        className="w-full h-full object-contain"
                        muted
                        playsInline
                        autoPlay
                        loop
                      />
                    ) : (
                      <>
                        <Image
                          src="/images/video-placeholder.png"
                          alt="Video example"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <p className="text-white text-sm font-medium">Your video here</p>
                        </div>
                      </>
                    )}
                  </div>

                  {videoMessage && (
                    <p className="text-green-400 text-sm -mt-2 mb-2">{videoMessage}</p>
                  )}
                </div>

                <p className="text-sm text-red-400 mb-4">
                  Only MP4, max 20MB, under 15 seconds.
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant={activeStep === 2 ? "default" : "outline"}
                  className={
                    activeStep === 2
                      ? "bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 border-0 text-white"
                      : "border-cyan-500/50 text-cyan-400 hover:text-white hover:bg-cyan-950/50"
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Video
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card className="p-8 h-full flex flex-col items-center text-center bg-gradient-to-br from-gray-900 to-purple-900/50 border-2 border-gray-800 backdrop-blur-sm">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-900 to-purple-700 flex items-center justify-center mb-6 relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-pink-600/50 blur-md"></div>

                    <Wand2 className="h-10 w-10 text-white relative z-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Final Step</h3>
                  <p className="text-gray-300 mb-4">Generate Your Animation</p>

                  {/* Result preview */}
                  <div className="relative w-full h-32 mb-6 rounded-lg overflow-hidden border border-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 flex items-center justify-center">
                      <Image src="/images/generator-placeholder.png" alt="Video example" fill className="object-cover" />
                      <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-10 h-10 rounded-full border-t-2 border-r-2 border-purple-400"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {hasUsedFree !== null && (
                  <p className={`text-sm mb-4 ${hasUsedFree ? "text-red-400" : "text-green-400"}`}>
                    {hasUsedFree
                      ? "❌ You’ve already used your free animation. Please upgrade to continue."
                      : "✅ You still have 1 free generation."}
                  </p>
                )}
                {isProUser && animationsLeft !== null ? (
                  animationsLeft > 40 ? (
                    <p className="text-green-400 text-sm mb-2">
                      ✅ Pro Plan: You have <strong>{animationsLeft}</strong> / 50 animations left.
                    </p>
                  ) : (
                    <p className="text-yellow-400 text-sm mb-2">
                      ⚠️ Pro Plan: {animationsLeft} / 50 animations remaining.
                    </p>
                  )
                ) : !isProUser && animationsLeft !== null ? (
                  animationsLeft > 5 ? (
                    <p className="text-green-400 text-sm mb-2">
                      ✅ Basic Plan: You have <strong>{animationsLeft}</strong> / 10 animations left.
                    </p>
                  ) : (
                    <p className="text-yellow-400 text-sm mb-2">
                      ⚠️ Basic Plan: {animationsLeft} / 10 animations remaining.
                    </p>
                  )
                ) : hasUsedFree ? (
                  <p className="text-red-400 text-sm mb-2">
                    ❌ You've used your 1 free animation. Please upgrade to continue.
                  </p>
                ) : (
                  <p className="text-green-400 text-sm mb-2">
                    ✅ Free Trial: You have 1 free animation available.
                  </p>
                )}
                <Button
                  onClick={async () => {
                    const user = auth.currentUser;
                    if (!user) {
                      alert("❌ User not authenticated.");
                      return;
                    }
                  
                    const fakeGeneratedUrl = "https://yourcdn.com/output/animation-fake-result.mp4"; // 替换为真实生成地址
                  
                    const resultMsg = await handleAnimationGeneration(user, fakeGeneratedUrl);
                    alert(resultMsg);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-700/20"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Run AI Magic
                </Button>
                {/* Social Share Buttons */}
                <div className="mt-8 flex flex-col items-center gap-4">
                  <p className="text-gray-400 text-sm">Proud of your creation?</p>

                  {/* 分享按钮组 */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <a
                      href="https://twitter.com/share?text=Check%20out%20my%20FaceMojo%20creation!&url=https://facemojo.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm"
                    >
                      Twitter
                    </a>
                    <a
                      href="https://www.facebook.com/sharer/sharer.php?u=https://facemojo.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 text-sm"
                    >
                      Facebook
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://facemojo.ai");
                        alert("✅ Link copied to clipboard!");
                      }}
                      className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 text-sm"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
