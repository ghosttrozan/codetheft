"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Image from "next/image";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type UniformType = "1f" | "1i" | "2f" | "3f" | "1fv" | "3fv";

interface UniformDefinition {
  type: UniformType;
  value:
    | number
    | [number]
    | [number, number]
    | [number, number, number]
    | [number, number, number][];
}

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value:
        | number
        | number[]
        | number[][]
        | THREE.Vector2
        | THREE.Vector3
        | THREE.Vector3[];
      type?: string;
    };
  };
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
}

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

// ========== COMPONENTS ==========
export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`${reverse ? "u_reverse_active" : "false"}_;animation_speed_factor_${animationSpeed.toFixed(1)}_;`}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
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
        ]) as number[][], // Explicitly type as number[][]
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
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

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
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

const ShaderMaterialComponent = ({
  source,
  uniforms,
}: {
  source: string;
  uniforms: {
    [key: string]: {
      value:
        | number
        | number[]
        | number[][] // Added support for number[][]
        | THREE.Vector2
        | THREE.Vector3
        | THREE.Vector3[];
      type?: string;
    };
  };
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    const material = ref.current.material as THREE.ShaderMaterial;

    // Update time uniform
    if (material.uniforms.u_time) {
      material.uniforms.u_time.value = timestamp;
    }
  });

  const material = useMemo(() => {
    const preparedUniforms: Record<string, THREE.IUniform> = {};

    // Convert the uniforms to THREE.IUniform format
    for (const [key, uniform] of Object.entries(uniforms)) {
      // Handle special case for u_colors (number[][])
      if (
        key === "u_colors" &&
        Array.isArray(uniform.value) &&
        Array.isArray(uniform.value[0])
      ) {
        preparedUniforms[key] = {
          value: (uniform.value as number[][]).map((v) =>
            new THREE.Vector3().fromArray(v)
          ),
        };
      }
      // Handle other uniform types
      else {
        preparedUniforms[key] = { value: uniform.value };
      }
    }

    // Add required uniforms
    preparedUniforms.u_time = { value: 0 };
    preparedUniforms.u_resolution = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };

    return new THREE.ShaderMaterial({
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
      uniforms: preparedUniforms,
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
      transparent: true,
    });
  }, [source, size.width, size.height, uniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className={`"absolute inset-0 h-full w-full" ${maxFps}`}>
      <ShaderMaterialComponent source={source} uniforms={uniforms} />
    </Canvas>
  );
};

export const Component = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const callbackUrl = "/";
  const [initialCanvasVisible] = useState(true);
  const [reverseCanvasVisible] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        toast.success("Signed In Successfully", {
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
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during sign in",
        {
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
        }
      );
    }
  };

  return (
    <div
      className={cn(
        "flex w-[100%] flex-col min-h-screen bg-black relative",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
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

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full p-6 md:p-0 mt-[150px] max-w-sm">
              <AnimatePresence mode="wait">
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
                      Welcome Back Developer
                    </h1>
                    <p className="text-[1.8rem] text-white/70 font-light">
                      Sign In to Continue
                    </p>
                  </div>
                  <form onSubmit={handleEmailSubmit}>
                    <div className="relative flex flex-col gap-4">
                      <input
                        type="email"
                        placeholder="Enter Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full backdrop-blur-[1px] text-white border-1 border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                        required
                      />
                      <input
                        type="password"
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
                        src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
                        alt="google logo"
                        width={20}
                        height={20}
                      />
                      <span>Sign In with Google</span>
                    </button>

                    <button
                      onClick={() => signIn("github", { callbackUrl: "/" })}
                      className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors"
                    >
                      <Image
                        src="https://imgs.search.brave.com/-vC0BCJo-U39NjwvkpfIB0cpHzi9_BsufUATXD4UHlA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvR2l0/aHViLUxvZ28tUE5H/LnBuZw"
                        alt="github logo"
                        width={24}
                        height={24}
                      />
                      <span>Sign In with GitHub</span>
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
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
