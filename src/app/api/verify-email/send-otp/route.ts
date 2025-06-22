import redis from "@/lib/redis";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const { email } = await req.json();
  
      if (!email) {
        return NextResponse.json(
          { message: "Email is required" },
          { status: 400 }
        );
      }
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Verify Redis connection
      try {
        await redis.ping(); // Test connection first
        await redis.set(`otp:${email}`, otp, "EX", 300);
      } catch (redisError) {
        console.error("Redis error:", redisError);
        return NextResponse.json(
          { message: "Database error" },
          { status: 500 }
        );
      }
  
      // Email configuration with better error handling
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Verify transporter
      await new Promise((resolve, reject) => {
        transporter.verify((error) => {
          if (error) {
            console.error('Mail transporter error:', error);
            reject(error);
          } else {
            console.log('Mail transporter ready');
            resolve(true);
          }
        });
      });
  
      // Send email
      await transporter.sendMail({
        from: `"CodeTheft Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your One-Time Passcode for CodeTheft",
        text: `
      CodeTheft Authentication
      
      Your verification code is: ${otp}
      
      This code will expire in 5 minutes. 
      If you didn't request this code, please ignore this email.
      
      © ${new Date().getFullYear()} CodeTheft. All rights reserved.
      `.trim(),
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .otp-code { 
            font-size: 24px; 
            letter-spacing: 2px; 
            color: #2c3e50;
            font-weight: bold;
            margin: 20px 0;
            padding: 10px;
            background: #f8f9fa;
            display: inline-block;
          }
          .footer { 
            margin-top: 20px; 
            padding-top: 10px; 
            border-top: 1px solid #eee; 
            font-size: 12px; 
            color: #7f8c8d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>CodeTheft Authentication</h2>
          </div>
          
          <p>Your verification code is:</p>
          <div class="otp-code">${otp}</div>
          
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} CodeTheft. All rights reserved.</p>
            <p>This is an automated message - please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
      `,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'X-Mailer': 'CodeTheft Authentication Service'
        }
      });
  
      return NextResponse.json(
        { message: "OTP sent successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in OTP generation:", error);
      return NextResponse.json(
        { message: "Failed to send OTP" },
        { status: 500 }
      );
    }
  }