import redis from "@/lib/redis";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {

         // First check if request has a body
         if (!req.body) {
            return NextResponse.json(
                { success: false, message: 'Request body is required' },
                { status: 400 }
            );
        }

        // Try to parse the JSON body
        let requestBody;
        try {
            requestBody = await req.json();
        } catch (parseError) {
            console.log("Error: ", parseError)
            return NextResponse.json(
                { success: false, message: 'Invalid JSON format in request body' },
                { status: 400 }
            );
        }

        // Destructure with null checks
        const { email, otp } = requestBody || {};

        console.log(email,otp)

        if(!email || !otp){
            return NextResponse.json({success: false, message:'invalid crediantiols'},{status:400})
        }

        const storedOtp = await redis.get(`otp:${email}`);

        if (!storedOtp) {
            return NextResponse.json({success: false, message:"OTP expired"}, {status: 401})
        }

        if (storedOtp !== otp) {
            return NextResponse.json(
                { success: false, message: "Invalid OTP" },
                { status: 401 }
              );
        }

        await redis.del(`otp:${email}`);

        await prisma.user.update({
            where:{
                email:email
            },
            data:{isVerified:true}
        })

        return NextResponse.json(
            { 
              success: true, 
              message: "OTP verified successfully",
            },
            { status: 200 }
          );

    } catch (error) {
        console.error("OTP verification error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
          );
    }
}