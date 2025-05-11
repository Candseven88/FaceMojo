"use client"

import { useEffect, useState, useRef } from "react"
import Script from "next/script"

interface LivePortraitEmbedProps {
  src: string
  title?: string
  className?: string
}

export function LivePortraitEmbed({
  src,
  title = "🎬 Try LivePortrait Animation",
  className = "",
}: LivePortraitEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const gradioInitialized = useRef(false)

  // 处理脚本加载完成事件
  const handleScriptLoad = () => {
    setIsLoading(false)
  }

  // 处理脚本加载错误事件
  const handleScriptError = () => {
    setIsLoading(false)
    setHasError(true)
  }
  
  // 确保Gradio组件正确初始化
  useEffect(() => {
    if (!isLoading && !hasError && !gradioInitialized.current) {
      // 给浏览器一点时间来处理自定义元素
      const timer = setTimeout(() => {
        gradioInitialized.current = true
        // 强制刷新gradio-app元素
        const gradioElements = document.querySelectorAll('gradio-app')
        gradioElements.forEach(el => {
          if (el.getAttribute('src') === src) {
            // 触发重新渲染
            el.setAttribute('src', src)
          }
        })
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isLoading, hasError, src])

  return (
    <div className={`max-w-5xl mx-auto px-4 py-12 ${className}`}>
      <div className="border rounded-xl p-6 shadow-xl bg-white text-black">
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
        
        {/* 加载Gradio脚本 */}
        <Script
          type="module"
          src="https://gradio.s3-us-west-2.amazonaws.com/4.37.2/gradio.js"
          onLoad={handleScriptLoad}
          onError={handleScriptError}
        />
        
        {/* 加载状态 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">正在加载 LivePortrait 组件...</p>
          </div>
        )}
        
        {/* 错误状态 */}
        {hasError && (
          <div className="text-center py-10 text-red-500">
            <p className="text-xl font-semibold mb-2">加载失败</p>
            <p>无法加载 LivePortrait 组件，请刷新页面重试。</p>
          </div>
        )}
        
        {/* Gradio Web组件 */}
        <div className={isLoading ? "hidden" : "block"}>
          <gradio-app src={src}></gradio-app>
        </div>
      </div>
    </div>
  )
}