
export const insertAdSenseAd = (container: Element | null) => {
  if (!container) return;

  if (container.querySelector('.adsbygoogle')) {
    return;
  }

  // Create the AdSense <ins> element
  const adElement = document.createElement("ins");
  adElement.className = "adsbygoogle";
  adElement.style.display = "block";
  adElement.style.width = "100%";
  
  adElement.setAttribute("data-ad-client", "ca-pub-5392438536247908"); // Replace with your AdSense Publisher ID
  adElement.setAttribute("data-ad-slot", "9043198183"); // Replace with your Ad slot ID
  adElement.setAttribute("data-ad-format", "horizontal");
  adElement.setAttribute("data-full-width-responsive", "false");

  // Append the ad to the container
  container.prepend(adElement);

  // Function to check and remove unfilled ads
  const removeUnfilledAd = () => {
      if (adElement.getAttribute("data-ad-status") === "unfilled") {
        adElement.style.display = "none"; // Hide container if ad is unfilled
      } else {
        adElement.style.height = "auto";
      }
  };

    // Observe changes in the ad element
    const observer = new MutationObserver(removeUnfilledAd);
    observer.observe(adElement, { attributes: true, attributeFilter: ["data-ad-status"] });


  // Push the ad to load
  try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
      adElement.style.height = "0px";
  } catch (error) {
      console.error("AdSense error:", error);
  }
};
