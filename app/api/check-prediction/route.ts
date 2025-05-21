import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // 指定这是一个动态API路由

// 设置更长的超时时间
export const config = {
  api: {
    responseLimit: false
  },
  maxDuration: 60 // 60秒超时
};

export async function GET(request: NextRequest) {
  console.log("API请求开始: check-prediction");
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

    // 使用 NextRequest 的 nextUrl 属性替代 request.url
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    console.log(`检查预测ID: ${id}`);

    if (!id) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    // 仅打印部分API令牌以验证（安全性考虑）
    const tokenPrefix = apiToken.substring(0, 5);
    const tokenSuffix = apiToken.substring(apiToken.length - 5);
    console.log(`使用API令牌: ${tokenPrefix}...${tokenSuffix}`);

    // Call Replicate API to check prediction status
    console.log(`正在查询Replicate API状态: ${id}`);
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        'Authorization': `Token ${apiToken}`,
      },
    });

    console.log(`Replicate API响应状态: ${response.status}`);

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
      
      // 确保返回正确格式的错误响应
      return new NextResponse(
        JSON.stringify({ 
          error: `Replicate API error: ${response.statusText}`,
          details: errorDetail || 'No additional details available'
        }),
        { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // 安全地解析响应
    let prediction;
    try {
      prediction = await response.json();
      console.log(`预测状态: ${prediction.status}`);
      return new NextResponse(
        JSON.stringify(prediction),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (jsonError) {
      console.error('解析JSON响应失败:', jsonError);
      
      // 尝试以文本形式读取响应内容
      const responseText = await response.text();
      console.error('响应文本内容:', responseText);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to parse API response',
          details: responseText.substring(0, 500) // 限制响应文本长度
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error: any) {
    console.error('服务器错误:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: `Server error: ${error.message}`,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 
