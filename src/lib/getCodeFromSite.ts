export async function getCodeFromSite({
  mode,
  prompt,
  language,
}: {
  mode: string;
  prompt: string;
  language: string;
}) {
  if (!mode || !prompt || !language) {
    return false;
  }

  const res = await fetch("/api/generate-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: prompt,
      mode,
      language,
    }),
  });

  const responseData = await res.json();
  return responseData;
}
