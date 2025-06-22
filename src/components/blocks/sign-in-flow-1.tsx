"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";
import Image from "next/image";
import toast from "react-hot-toast";
import { sendCode, signUp, verifyCode } from "@/lib/authentications";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false, // This controls the direction
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean; // This prop determines the direction
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      {" "}
      {/* Removed bg-white */}
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          // Pass reverse state and speed via string flags in the empty shader prop
          shader={`
            ${reverse ? "u_reverse_active" : "false"}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        // Adjust gradient colors if needed based on background (was bg-white, now likely uses containerClassName bg)
        // Example assuming a dark background like the SignInPage uses:
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "", // This shader string will now contain the animation logic
  center = ["x", "y"],
}) => {
  // ... uniforms calculation remains the same for colors, opacities, etc.
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0, // Convert boolean to number (1 or 0)
        type: "uniform1i", // Use 1i for bool in WebGL1/GLSL100, or just bool for GLSL300+ if supported
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]); // Add shader to dependencies

  return (
    <Shader
      // The main animation logic is now built *outside* the shader prop
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse; // Changed from bool to int

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2); // Used for initial opacity random pick and color
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            // --- Animation Timing Logic ---
            float animation_speed_factor = 0.5; // Extract speed from shader string
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            // Calculate timing offset for Intro (from center)
            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            // Calculate timing offset for Outro (from edges)
            // Max distance from center to a corner of the grid
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);


            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 // Outro logic: opacity starts high, goes to 0 when time passes offset
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 // Clamp for fade-out transition
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 // Intro logic: opacity starts 0, goes to base opacity when time passes offset
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 // Clamp for fade-in transition
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }


            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a; // Premultiply alpha
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();

    lastFrameTime = timestamp;

    const material: any = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    }; // Initialize u_resolution
    return preparedUniforms;
  };

  // Shader material
  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0  h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

export const SignInPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState("");
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#7f1d1d",
          color: "#fecaca",
          border: "1px solid #b91c1c",
        },
        iconTheme: {
          primary: "#fecaca",
          secondary: "#7f1d1d",
        },
      });
      return;
    }

    try {
      const res = await signUp({ name, email, password });

      if (res.errors) {
        toast.error(res.errors[0] || "Error occurred during sign up", {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#7f1d1d",
            color: "#fecaca",
            border: "1px solid #b91c1c",
          },
          iconTheme: {
            primary: "#fecaca",
            secondary: "#7f1d1d",
          },
        });
        return;
      }

      if (res.success) {
        toast.success("Sign up successful! Please verify your email", {
          style: {
            borderRadius: "10px",
            background: "#14532d",
            color: "#bbf7d0",
            border: "1px solid #166534",
          },
          iconTheme: {
            primary: "#bbf7d0",
            secondary: "#14532d",
          },
        });

        setStep("code");

        try {
          await toast.promise(sendCode(email), {
            loading: "Sending verification code...",
            success: "Verification code sent!",
            error: "Failed to send code. Please try again.",
          });
        } catch (error) {
          console.error("Error sending verification code:", error);
        }
      } else {
        toast.error("Error occurred. Please try again later", {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#7f1d1d",
            color: "#fecaca",
            border: "1px solid #b91c1c",
          },
          iconTheme: {
            primary: "#fecaca",
            secondary: "#7f1d1d",
          },
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("An unexpected error occurred during sign up");
    }
  };

  // Focus first input when code screen appears
  useEffect(() => {
    if (step === "code") {
      const timer = setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCode(value.slice(0, 6)); // Ensure max 6 digits
    // Auto-submit when 6 digits entered
    if (value.length == 6) {
      handleVerifyCode(value);
    }
  };

  const handleVerifyCode = async (value) => {
    try {

      if (value.length !== 6) {
        toast.error("Please enter all 6 digits");
        return;
      }
      const verificationRes = await verifyCode(email, value);

      if (verificationRes.ok) {
        toast.success("OTP verified successfully!", {
          style: {
            borderRadius: "10px",
            background: "#14532d",
            color: "#bbf7d0",
            border: "1px solid #166534",
          },
          iconTheme: {
            primary: "#bbf7d0",
            secondary: "#14532d",
          },
        });

        // Show animation effects
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);

        // Then attempt to sign in
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInRes?.ok) {
          toast.success("Successfully signed in! Redirecting...");
          router.push("/");
        } else {
          toast.error(signInRes?.error || "Sign in failed. Please try again.");
          router.push("/auth/sign-in");
        }
      } else {
        toast.error("Invalid verification code");
        setCode("");
        codeInputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred during verification");
      setCode("");
      codeInputRefs.current[0]?.focus();
    }
  };

  const resendOtp = async () => {
    try {
      await toast.promise(sendCode(email), {
        loading: "Sending new verification code...",
        success: "New verification code sent!",
        error: "Failed to send code. Please try again.",
      });
      setCode("");
      codeInputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode("");
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div
      className={cn(
        "flex w-[100%] flex-col min-h-screen bg-black relative",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        {/* Initial canvas (forward animation) */}
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}

        {/* Reverse canvas (appears when code is complete) */}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Main content container */}
        <div className="flex flex-1 flex-col lg:flex-row ">
          {/* Left side (form) */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full p-6 md:p-0 mt-[150px] max-w-sm">
              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                        Welcome Developer
                      </h1>
                      <p className="text-[1.8rem] text-white/70 font-light">
                        Sign Up to Continue{" "}
                      </p>
                    </div>
                    <form onSubmit={handleEmailSubmit}>
                      <div className="relative  flex flex-col gap-4">
                        <input
                          type="text"
                          placeholder="Enter Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full backdrop-blur-[1px] text-white border-1 border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                        />
                        <input
                          type="email"
                          placeholder="Enter Your Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full backdrop-blur-[1px] text-white border-1 border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full backdrop-blur-[1px] text-white border-1 border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                          required
                        />
                        <button
                          type="submit"
                          className="absolute right-2 md:right-1.5 bottom-2 md:bottom-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden"
                        >
                          <span className="relative w-full h-full block overflow-hidden">
                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                              →
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                              →
                            </span>
                          </span>
                        </button>
                      </div>
                    </form>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/40 text-sm">or</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors"
                      >
                        <Image
                          src={
                            "https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
                          }
                          alt="google logo"
                          width={20}
                          height={20}
                        />
                        <span>Sign Up with Google</span>
                      </button>

                      <button
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors"
                      >
                        <Image
                          src={
                            "https://imgs.search.brave.com/-vC0BCJo-U39NjwvkpfIB0cpHzi9_BsufUATXD4UHlA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvR2l0/aHViLUxvZ28tUE5H/LnBuZw"
                          }
                          alt="google logo"
                          width={24}
                          height={24}
                        />
                        <span>Sign Up with GIthub</span>
                      </button>
                    </div>

                    <p className="text-xs text-white/40 pt-10">
                      By signing up, you agree to the{" "}
                      <Link
                        href="#"
                        className="underline text-white/40 hover:text-white/60 transition-colors"
                      >
                        MSA
                      </Link>
                      ,{" "}
                      <Link
                        href="#"
                        className="underline text-white/40 hover:text-white/60 transition-colors"
                      >
                        Product Terms
                      </Link>
                      ,{" "}
                      <Link
                        href="#"
                        className="underline text-white/40 hover:text-white/60 transition-colors"
                      >
                        Policies
                      </Link>
                      ,{" "}
                      <Link
                        href="#"
                        className="underline text-white/40 hover:text-white/60 transition-colors"
                      >
                        Privacy Notice
                      </Link>
                      , and{" "}
                      <Link
                        href="#"
                        className="underline text-white/40 hover:text-white/60 transition-colors"
                      >
                        Cookie Notice
                      </Link>
                      .
                    </p>
                  </motion.div>
                ) : step === "code" ? (
                  <motion.div
                    key="code-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                        We sent you a code
                      </h1>
                      <p className="text-[1.25rem] text-white/50 font-light">
                        Please enter it
                      </p>
                    </div>

                    <div className="w-full">
                      <div className="relative rounded-full py-4 px-5 border border-white/10 bg-transparent">
                        <div className="flex items-center justify-center">
                          <div className="relative w-full">
                            <input
                              ref={codeInputRefs}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]{6}"
                              maxLength={6}
                              value={code}
                              onChange={handleCodeChange}
                              className="w-full text-center text-xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none"
                              style={{
                                caretColor: "transparent",
                                letterSpacing: "1.5rem",
                                paddingLeft: "0.75rem",
                              }}
                            />

                            {/* Visual digit indicators */}
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none gap-1">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={` inline-flex items-center justify-center w-8 h-10 text-xl ${i < code.length ? "text-transparent" : "text-white/20"} transition-colors duration-100`}
                                >
                                  {i < code.length ? code[i] : "•"}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <motion.p
                        className="text-white/50 hover:text-white/70 transition-colors cursor-pointer text-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                          // Resend code logic
                          resendOtp(email);
                          setCode("");
                          if (codeInputRefs.current) {
                            codeInputRefs.current.focus();
                          }
                        }}
                      >
                        Resend codee
                      </motion.p>
                    </div>

                    <div className="flex w-full gap-3">
                      <motion.button
                        onClick={handleBackClick}
                        className="rounded-full bg-white text-black font-medium px-8 py-3 hover:bg-white/90 transition-colors w-[30%]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        Back
                      </motion.button>
                      <motion.button
                        onClick={handleVerifyCode}
                        className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                          code.length === 6
                            ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer"
                            : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                        }`}
                        disabled={code.length !== 6}
                        whileHover={{ scale: code.length === 6 ? 1.02 : 1 }}
                        whileTap={{ scale: code.length === 6 ? 0.98 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        Continue
                      </motion.button>
                    </div>

                    {/* ... (keep the rest of your JSX) */}
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                        You're in!
                      </h1>
                      <p className="text-[1.25rem] text-white/50 font-light">
                        Welcome
                      </p>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="py-10"
                    >
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-white to-white/70 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-black"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="w-full rounded-full bg-white text-black font-medium py-3 hover:bg-white/90 transition-colors"
                    >
                      Continue to Dashboard
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
