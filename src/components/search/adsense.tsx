
export const insertAdSenseAd = (container: Element | null) => {
  if (!container) return;

  if (container.querySelector('.adsbygoogle')) {
    return;
  }

  // Create the AdSense <ins> element
  const adElement = document.createElement("ins");
  adElement.className = "adsbygoogle";
  adElement.style.display = "block";
  adElement.setAttribute("data-ad-client", "ca-pub-5392438536247908"); // Replace with your AdSense Publisher ID
  adElement.setAttribute("data-ad-slot", "9043198183"); // Replace with your Ad slot ID
  adElement.setAttribute("data-ad-format", "horizontal");
  adElement.setAttribute("data-full-width-responsive", "true");

  // Append the ad to the container
  container.prepend(adElement);

  // Push the ad to load
  try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
  } catch (error) {
      console.error("AdSense error:", error);
  }
};
