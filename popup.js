const toggle = document.getElementById('toggle');

chrome.storage.sync.get(['hideHeadingsEnabled'], (result) => {
    toggle.checked = result.hideHeadingsEnabled ?? false; // Default to enabled
});

toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
  
    chrome.storage.sync.set({ hideHeadingsEnabled: isEnabled });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: updateHeadingsVisibility,
          args: [isEnabled]
        });
    });
});

function updateHeadingsVisibility(isEnabled) {
    const headings = document.querySelectorAll('.recording-RecordingItem__info--2ChBi, .facet-Facet__facetPart--1TEeX, img');
    headings.forEach(heading => {
      heading.style.display = isEnabled ? 'none' : '';
    });
  }


function perfList() {
  perfArr = Array.from(document.querySelectorAll(".recording-RecordingItem__info--2ChBi:nth-child(2) > span")).map(function(obj) {return obj.innerHTML});
  dateArr = Array.from(document.querySelectorAll(".recording-RecordingItem__info--2ChBi > .facet-Facet__facetPart--1TEeX:first-child > span")).map(function(obj) {return obj.innerText});
  dupes = perfArr.filter((item, index) => perfArr.indexOf(item) !== index);
  for (let i = 0; i < perfArr.length; i++) {
    if (dupes.includes(perfArr[i])) {
      let date = dateArr[i].replace(/[^0-9\-]/g, '');
      perfArr[i] += ` (${date})`;
    }
  }
  return perfArr.join("\n");
}

document.getElementsByClassName("copy")[0].addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: perfList,
      },
      (injectionResults) => {
        const [result] = injectionResults;
        if (result?.result) {
          // Copy the text received from the content script to the clipboard
          navigator.clipboard.writeText(result.result)
            .then(() => console.log('Text copied to clipboard!'))
            .catch((err) => console.error('Failed to copy:', err));
        } else {
          alert('No text found to copy.');
        }
      }
    );
  });
});