import { FeatureSteps } from "@/components/blocks/feature-section";
import pic1 from "@/assets/demo1.jpeg";
import pic2 from "@/assets/demo2.jpeg";
import pic3 from "@/assets/demo3.jpeg";
import pic4 from "@/assets/demo4.jpeg";
import pic5 from "@/assets/demo5.jpeg";

const features = [
  {
    step: "Step 1",
    title: "Enter Valid Website Url",
    content:
      "Start by entering a valid url. you have free 50 credits. Url should be wnd with proper domain nam like .com, .in etc",
    image: pic1,
  },
  {
    step: "Step 2",
    title: "Choose Output Code Format",
    content:
      "Choose one code output format like jsx, react, html/css/js as your need",
    image: pic2,
  },
  {
    step: "Step 3",
    title: "Wait A Moment",
    content:
      "Your request is submitted and server started generating code it will may take a long time if website is heavy so wait for server response.",
    image: pic3,
  },
  {
    step: "Step 4",
    title: "Successful Code Scrapped",
    content:
      "Now server generated your code you can preview and edit it in the page each successful scrapping cost you 10 credits.",
    image: pic4,
  },
  {
    step: "Step 5",
    title: "Preview In Browser",
    content: "You can preview the code in browser for better experience.",
    image: pic5,
  },
];

export default function FeatureStepsDemo() {
  return (
    <div className="flex items-center pt-24 justify-center w-full h-full">
      <FeatureSteps
        className="text-white"
        features={features}
        title="Your Journey Starts Here"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
    </div>
  );
}
