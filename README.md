<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeTheft - AI-Powered Code Scraping</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Poppins:wght@300;400;600;700&display=swap');
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #0f172a;
            color: #e2e8f0;
        }
        
        .code-font {
            font-family: 'JetBrains Mono', monospace;
        }
        
        .gradient-text {
            background: linear-gradient(90deg, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        
        .tech-stack-item {
            transition: all 0.3s ease;
            border-left: 3px solid #38bdf8;
        }
        
        .tech-stack-item:hover {
            background-color: #1e293b;
            border-left: 3px solid #818cf8;
        }
    </style>
</head>
<body class="min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-12">
        <!-- Header -->
        <header class="text-center mb-16">
            <div class="flex justify-center mb-6">
                <div class="w-full h-64 rounded-xl overflow-hidden">
                    <img src="https://placehold.co/1200x400/1a1a2e/FFFFFF?text=CodeTheft%20-%20AI%20Code%20Scraping%20Powerhouse" 
                         alt="CodeTheft Banner" class="w-full h-full object-cover">
                </div>
            </div>
            <h1 class="text-5xl font-bold mb-4 gradient-text">CodeTheft</h1>
            <p class="text-xl text-slate-300 max-w-3xl mx-auto">
                AI-Powered Code Scraping & Enhancement Tool
                <span class="text-3xl ml-2">🚀</span>
            </p>
        </header>

        <!-- Intro -->
        <section class="mb-16 text-center">
            <p class="text-lg text-slate-300 max-w-4xl mx-auto">
                CodeTheft is a cutting-edge web scraping tool specifically designed for developers to extract, 
                filter, and enhance code from web pages using advanced AI capabilities. Perfect for learning, 
                research, and code discovery.
            </p>
        </section>

        <!-- Features -->
        <section class="mb-20">
            <h2 class="text-3xl font-bold mb-8 text-center gradient-text">✨ Key Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Feature 1 -->
                <div class="feature-card bg-slate-800 p-6 rounded-xl transition-all duration-300">
                    <div class="text-blue-400 mb-4 text-2xl">
                        <i class="fas fa-user-secret"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Stealthy Code Scraping</h3>
                    <p class="text-slate-300">
                        Extract raw code from any webpage without detection using advanced evasion techniques.
                    </p>
                </div>
                
                <!-- Feature 2 -->
                <div class="feature-card bg-slate-800 p-6 rounded-xl transition-all duration-300">
                    <div class="text-purple-400 mb-4 text-2xl">
                        <i class="fas fa-robot"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">AI-Powered Enhancement</h3>
                    <p class="text-slate-300">
                        Clean and improve scraped code with Gemini AI's advanced analysis capabilities.
                    </p>
                </div>
                
                <!-- Feature 3 -->
                <div class="feature-card bg-slate-800 p-6 rounded-xl transition-all duration-300">
                    <div class="text-green-400 mb-4 text-2xl">
                        <i class="fas fa-filter"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Precision Filtering</h3>
                    <p class="text-slate-300">
                        Isolate only the relevant code snippets with surgical precision.
                    </p>
                </div>
                
                <!-- Feature 4 -->
                <div class="feature-card bg-slate-800 p-6 rounded-xl transition-all duration-300">
                    <div class="text-yellow-400 mb-4 text-2xl">
                        <i class="fas fa-code-branch"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Multi-Source Support</h3>
                    <p class="text-slate-300">
                        Works with GitHub, GitLab, StackOverflow, and other developer platforms.
                    </p>
                </div>
                
                <!-- Feature 5 -->
                <div class="feature-card bg-slate-800 p-6 rounded-xl transition-all duration-300">
                    <div class="text-red-400 mb-4 text-2xl">
                        <i class="fas fa-file-export"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Export Options</h3>
                    <p class="text-slate-300">
                        Download enhanced code in multiple formats for easy integration.
                    </p>
                </div>
                
                <!-- Feature 6 -->
                <div class="feature-card bg-slate-800 p-6 rounded-xl transition-all duration-300">
                    <div class="text-cyan-400 mb-4 text-2xl">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Rate Limit Bypass</h3>
                    <p class="text-slate-300">
                        Intelligent request throttling to avoid blocks and bans.
                    </p>
                </div>
            </div>
        </section>

        <!-- Tech Stack -->
        <section class="mb-20">
            <h2 class="text-3xl font-bold mb-8 text-center gradient-text">🛠 Tech Stack Deep Dive</h2>
            
            <div class="space-y-8">
                <!-- Core Scraping -->
                <div class="tech-stack-item bg-slate-800/50 p-6 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4 text-blue-400">
                        <i class="fas fa-cogs mr-2"></i> Core Scraping Engine
                    </h3>
                    <div class="pl-6 space-y-4">
                        <div>
                            <h4 class="text-lg font-medium text-slate-200">Browserless API</h4>
                            <ul class="text-slate-400 list-disc list-inside mt-2 space-y-1">
                                <li>Headless browser automation for scraping dynamic content</li>
                                <li>Bypasses anti-bot measures</li>
                                <li>Renders JavaScript-heavy pages</li>
                                <li>Simulates human-like browsing patterns</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-lg font-medium text-slate-200">Cheerio</h4>
                            <ul class="text-slate-400 list-disc list-inside mt-2 space-y-1">
                                <li>Lightweight jQuery implementation for server-side DOM manipulation</li>
                                <li>Blazing fast HTML parsing</li>
                                <li>CSS-selector based element targeting</li>
                                <li>Efficient code extraction from raw HTML</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- AI Enhancement -->
                <div class="tech-stack-item bg-slate-800/50 p-6 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4 text-purple-400">
                        <i class="fas fa-brain mr-2"></i> AI Enhancement
                    </h3>
                    <div class="pl-6">
                        <h4 class="text-lg font-medium text-slate-200">Google Gemini AI</h4>
                        <ul class="text-slate-400 list-disc list-inside mt-2 space-y-1">
                            <li>State-of-the-art AI for code analysis and enhancement</li>
                            <li>Code cleanup and formatting</li>
                            <li>Syntax error detection</li>
                            <li>Performance optimization suggestions</li>
                            <li>Documentation generation</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Backend -->
                <div class="tech-stack-item bg-slate-800/50 p-6 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4 text-green-400">
                        <i class="fas fa-server mr-2"></i> Backend
                    </h3>
                    <ul class="text-slate-400 list-disc list-inside mt-2 space-y-1 pl-6">
                        <li><span class="font-medium text-slate-200">Node.js (v20)</span> - JavaScript runtime for high-performance scraping</li>
                        <li><span class="font-medium text-slate-200">Next.js</span> - Interactive UI</li>
                        <li><span class="font-medium text-slate-200">Shadcn</span> - Modern component library</li>
                        <li><span class="font-medium text-slate-200">Axios</span> - HTTP client for API requests</li>
                        <li><span class="font-medium text-slate-200">Rate Limiter</span> - Intelligent request throttling to avoid IP bans</li>
                    </ul>
                </div>
                
                <!-- Utility Libraries -->
                <div class="tech-stack-item bg-slate-800/50 p-6 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4 text-yellow-400">
                        <i class="fas fa-tools mr-2"></i> Utility Libraries
                    </h3>
                    <ul class="text-slate-400 list-disc list-inside mt-2 space-y-1 pl-6">
                        <li><span class="font-medium text-slate-200">Puppeteer Extra</span> - Enhanced scraping capabilities</li>
                        <li><span class="font-medium text-slate-200">Stealth Plugin</span> - Avoid fingerprinting detection</li>
                        <li><span class="font-medium text-slate-200">User-Agent Rotator</span> - Randomize request signatures</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Getting Started -->
        <section class="mb-20">
            <h2 class="text-3xl font-bold mb-8 text-center gradient-text">🚀 Getting Started</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Prerequisites -->
                <div class="bg-slate-800/50 p-6 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4 text-red-400">
                        <i class="fas fa-clipboard-check mr-2"></i> Prerequisites
                    </h3>
                    <ul class="text-slate-400 list-disc list-inside space-y-2">
                        <li>Node.js v18+</li>
                        <li>Next.js v15</li>
                        <li>Browserless API key</li>
                        <li>Google Gemini API key</li>
                    </ul>
                </div>
                
                <!-- Installation -->
                <div class="bg-slate-800/50 p-6 rounded-lg">
                    <h3 class="text-2xl font-semibold mb-4 text-cyan-400">
                        <i class="fas fa-download mr-2"></i> Installation
                    </h3>
                    <div class="bg-slate-900 p-4 rounded-lg code-font">
                        <pre class="text-green-400"># Clone the repository
git clone https://github.com/ghosttrozan/codetheft.git

# Install dependencies
cd codetheft
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env

# Start the server
npm run dev</pre>
                    </div>
                </div>
            </div>
        </section>

        <!-- Legal Disclaimer -->
        <section class="mb-16 bg-rose-900/20 p-6 rounded-lg border border-rose-900/50">
            <h2 class="text-2xl font-bold mb-4 text-rose-400">
                <i class="fas fa-exclamation-triangle mr-2"></i> Legal Disclaimer
            </h2>
            <p class="text-slate-300 mb-4">
                CodeTheft is intended for educational purposes and legitimate code research only. 
                Users are responsible for complying with:
            </p>
            <ul class="text-slate-400 list-disc list-inside space-y-1">
                <li>Website terms of service</li>
                <li>Copyright laws</li>
                <li>Fair use principles</li>
            </ul>
            <p class="text-slate-300 mt-4 font-medium">
                Always obtain proper authorization before scraping any website.
            </p>
        </section>

        <!-- Footer -->
        <footer class="text-center pt-8 border-t border-slate-700/50">
            <div class="flex justify-center mb-4">
                <img src="https://placehold.co/100/1a1a2e/FFFFFF?text=CT" 
                     alt="CodeTheft Logo" class="w-16 h-16 rounded-full">
            </div>
            <p class="text-slate-400">
                Made with <span class="text-rose-500">❤️</span> (and a bit of mischief) by 
                <span class="font-medium text-blue-400">Alkaif</span>
            </p>
            <div class="flex justify-center space-x-4 mt-4">
                <a href="#" class="text-slate-400 hover:text-blue-400 transition">
                    <i class="fab fa-github text-xl"></i>
                </a>
                <a href="#" class="text-slate-400 hover:text-blue-400 transition">
                    <i class="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" class="text-slate-400 hover:text-blue-400 transition">
                    <i class="fab fa-discord text-xl"></i>
                </a>
            </div>
        </footer>
    </div>
</body>
</html>
