import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { prisma } from "@/lib/db";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDyTNKPSwkLCwN-nERV2Bhp10lof7k4Vv4",
});

export async function POST(request: Request) {
  const { url, mode, language } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await session.user;

  const userId = parseInt(id, 10);

  const checkUser = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!checkUser) {
    return NextResponse.json(
      { success: false, message: "User Not Found" },
      { status: 400 }
    );
  }

  if ((checkUser.credits as number) <= 0) {
    return NextResponse.json(
      { success: false, message: "Bhaaaaaaaaaaaaaag bkl" },
      { status: 400 }
    );
  }

  if (!url) {
    return NextResponse.json(
      { success: false, message: "URL is required" },
      { status: 400 }
    );
  }

  if (mode == "url") {
    try {
      const browser = await chromium.launch({
        headless: true,
      });

      const page = await browser.newPage();

      // Go to the page and wait for full load
      await page.goto("https://www." + url, {
        waitUntil: "load",
        timeout: 60000,
      });

      // Wait extra for lazy content
      await page.waitForTimeout(5000);

      // Get full rendered HTML
      const rawHtml = await page.content();

      await browser.close();

      // 🧼 Clean JS using Cheerio
      const $ = cheerio.load(rawHtml);
      $("script").remove(); // remove <script> tags
      const cleanHtml = $.html();

      const prompt = `
            You are an expert front-end developer specializing in ${language} development. Your task is to convert, refactor, and enhance the following HTML code into a production-ready ${language} and default function name should me Result component.

            Input Requirements:
            1. Analyze the provided HTML structure and functionality
            2. Identify all UI components and their relationships
            3. Note any existing styling patterns or design language

            Conversion Guidelines:
            - Convert all markup to proper ${language} syntax
            - For React: Create functional components with proper JSX syntax
            - For HTML/CSS: Ensure semantic HTML5 structure
            - For HTML/CSS/JS: Include vanilla JavaScript for interactivity

            Styling Requirements:
            1. CSS Architecture:
            - Use ${language === "React" ? "inline Tailwind CSS" : "inline normal CSS"}       for styling
            - Implement responsive design with mobile-first approach

            2. Visual Enhancements:
            - Apply modern UI/UX principles
            - Ensure proper spacing and typography hierarchy
            - Add smooth transitions for interactive elements
            - Implement accessible color contrast

            3. Functionality Improvements:
            - Add proper event handling
            - Implement error states where needed
            - Ensure all interactive elements have proper states (:hover, :focus, etc.)
            - Add basic form validation if applicable

            Performance Considerations:
            - Optimize asset loading
            - Minimize DOM manipulations
            - Use efficient CSS selectors
            - Implement lazy loading where appropriate

          Accessibility Requirements:
          - ARIA attributes where needed
          - Keyboard navigation support
          - Screen reader compatibility
          - Proper heading structure

         Output Format:
          - Single ${language} file with all dependencies
          - Clean, well-commented code
          - Organized imports/dependencies
          - Proper indentation and formatting
          - Only Code no additional texts only pure code

        Additional Notes:
        - Preserve all original functionality
        - Enhance where possible without changing core behavior
        - Document any assumptions made
        - Include TODO comments for future improvements

        Here is the code to convert:
                                      ${cleanHtml}

  Please provide the complete refactored ${language} implementation with all necessary dependencies.
  `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: 5,
          },
        },
      });

      return NextResponse.json({ success: true, code: response.text });
    } catch (err: any) {
      console.error("Playwright Error:", err.message);
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    }
  }
}
