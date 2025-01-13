
// Function to hide all headings
function hideHeadings() {
    const headings = document.querySelectorAll('.recording-RecordingItem__info--2ChBi, .facet-Facet__facetPart--1TEeX, img');
    headings.forEach(heading => {
      heading.style.display = 'none';
    });
  }
  
  // Function to handle the toggle state
  function toggleHeadings() {
    chrome.storage.sync.get(['hideHeadingsEnabled'], (result) => {
      if (result.hideHeadingsEnabled) {
        hideHeadings();
      }
    });
  }
  
  // Initial run
  toggleHeadings();
  
  // Set up a MutationObserver to watch for new elements being added
  const observer = new MutationObserver(toggleHeadings);
  observer.observe(document.body, { childList: true, subtree: true });
  

