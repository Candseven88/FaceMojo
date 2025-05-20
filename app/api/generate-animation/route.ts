import { NextResponse } from 'next/server';

const MAX_BASE64_SIZE = 20 * 1024 * 1024; // 20MB 限制

export async function POST(request: Request) {
  console.log("API请求开始: generate-animation");
  try {
    // 检查API令牌是否设置
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      console.error('REPLICATE_API_TOKEN未设置');
      return NextResponse.json(
        { error: 'Server configuration error: API token not set' },
        { status: 500 }
      );
    }
    
    console.log("已找到API令牌，准备解析请求数据");
    
    // 解析请求数据
    let requestData;
    try {
      requestData = await request.json();
    } catch (e) {
      console.error('请求解析错误:', e);
      return NextResponse.json(
        { error: 'Failed to parse request data' },
        { status: 400 }
      );
    }
    
    const { image, video } = requestData;

    if (!image || !video) {
      console.error('缺少图像或视频数据');
      return NextResponse.json(
        { error: 'Image and video are required' },
        { status: 400 }
      );
    }
    
    // 检查文件大小
    if (image.length > MAX_BASE64_SIZE || video.length > MAX_BASE64_SIZE) {
      console.error('文件大小超出限制');
      return NextResponse.json(
        { error: 'File size exceeds the limit (20MB)' },
        { status: 413 }
      );
    }
    
    console.log("准备调用Replicate API");
    
    // 仅打印部分API令牌以验证（安全性考虑）
    const tokenPrefix = apiToken.substring(0, 5);
    const tokenSuffix = apiToken.substring(apiToken.length - 5);
    console.log(`使用API令牌: ${tokenPrefix}...${tokenSuffix}`);
    
    // 准备请求主体
    const requestBody = {
      version: "a6ea89def8d2125215e4d2f920d608b171866840f8b5bff3be46c4c1ce9b259b",
      input: {
        image,
        video
      }
    };
    
    // 调用Replicate API
    console.log("发送请求到Replicate API");
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log("Replicate API响应状态:", response.status);
    
    // 处理响应
    if (!response.ok) {
      console.error('Replicate API错误:', response.status, response.statusText);
      
      let errorDetail = '';
      let errorBody = null;
      
      try {
        errorBody = await response.json();
        errorDetail = JSON.stringify(errorBody);
        console.error('错误详情:', errorBody);
      } catch (e) {
        console.error('无法解析错误响应:', e);
        try {
          // 尝试以文本形式读取
          const textError = await response.text();
          errorDetail = textError;
          console.error('错误响应文本:', textError);
        } catch (textError) {
          console.error('无法读取错误响应文本:', textError);
        }
      }
      
      return NextResponse.json(
        { 
          error: `Replicate API error: ${response.statusText}`,
          details: errorDetail || 'No additional details available'
        },
        { status: response.status }
      );
    }
    
    // 成功处理
    const prediction = await response.json();
    console.log("成功获取预测结果:", prediction.id);
    return NextResponse.json(prediction);
    
  } catch (error: any) {
    console.error('服务器错误:', error);
    return NextResponse.json(
      { 
        error: `Server error: ${error.message}`,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
} 
