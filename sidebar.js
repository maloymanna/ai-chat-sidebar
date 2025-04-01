const llmSelector = document.getElementById('llmSelector');
const chatArea = document.getElementById('chatArea');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

async function sendMessage(message, llm) {
  chatArea.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  messageInput.value = '';

  let response = '';

  try {
    switch (llm) {
      case 'openai':
        response = await handleOpenAI(message);
        break;
      case 'claude':
        response = await handleClaude(message);
        break;
      case 'perplexity':
        response = await handlePerplexity(message);
        break;
      case 'deepseek':
        response = await handleDeepseek(message);
        break;
      case 'qwen':
        response = await handleQwen(message);
        break;
      case 'kimi':
        response = await handleKimi(message);
        break;
      case 'gemini':
        response = await handleGemini(message);
        break;
      default:
        response = 'LLM not implemented.';
    }
  } catch (error) {
    console.error('Error sending message:', error);
    response = `Error: ${error.message}`;
  }

  chatArea.innerHTML += `<p><strong>${llm}:</strong> ${response}</p>`;
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Function to get cookies for specific domains
async function getCookies(domain) {
  return await chrome.cookies.getAll({ domain: domain });
}
//Helper function for fetch
async function fetchData(url, options = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'fetchData', url, options }, response => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response.data);
      }
    });
  });
}

async function handleOpenAI(message) {
  const url = "https://chatgpt.com/";
  try {
    const isLoggedIn = await checkLoggedIn('https://chatgpt.com/');
    if (!isLoggedIn) {
      return "User not logged in to OpenAI ChatGPT. Please log in to chat.openai.com in a separate tab.";
    }

    // Use a simplified approach, adjust as needed for the actual ChatGPT site.
    const formData = new FormData();
    formData.append("prompt", message);
    const options = {
      method: 'POST',
      body: formData,
    };

    const text = await fetchData(url, options);
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const responseElement = doc.querySelector('div[data-message-id]');
    if (responseElement)
      return responseElement.textContent;
    else
      return "Could not extract response from OpenAI.  The website structure may have changed.";

  } catch (error) {
    console.error("OpenAI Fetch Error:", error);
    return "Failed to get response from OpenAI: " + error.message;
  }
}

async function handleClaude(message) {
  const url = "https://claude.ai/";
  try {
    const isLoggedIn = await checkLoggedIn('https://claude.ai');
    if (!isLoggedIn) {
      return "User not logged in to Claude.ai. Please log in to claude.ai in a separate tab.";
    }
    const formData = new FormData();
    formData.append("message", message);
    const options = {
      method: 'POST',
      body: formData,
    };
    const text = await fetchData(url, options);
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const responseElement = doc.querySelector('div.message.sender');
    if (responseElement) {
      return responseElement.textContent;
    }
    else {
      return "Could not extract response from Claude. The website structure may have changed.";
    }

  } catch (error) {
    console.error("Claude Fetch Error:", error);
    return "Failed to get response from Claude: " + error.message;
  }
}



async function handlePerplexity(message) {
  const url = "https://www.perplexity.ai/";
  try {
    const isLoggedIn = await checkLoggedIn('https://www.perplexity.ai');
    if (!isLoggedIn) {
      return "User not logged in to Perplexity.ai. Please log in to www.perplexity.ai in a separate tab.";
    }
    const formData = new FormData();
    formData.append("q", message);
    const options = {
      method: 'POST',
      body: formData,
    };
    const text = await fetchData(url, options);
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const responseElement = doc.querySelector('div[data-testid="answer"]');
    if (responseElement) {
      return responseElement.textContent;
    }
    else {
      return "Could not extract response from Perplexity. The website structure may have changed.";
    }

  } catch (error) {
    console.error("Perplexity Fetch Error:", error);
    return "Failed to get response from Perplexity: " + error.message;
  }
}

async function handleDeepseek(message) {
  const url = "https://chat.deepseek.com/";
  try {
        const isLoggedIn = await checkLoggedIn('https://chat.deepseek.com');
        if (!isLoggedIn) {
            return "User not logged in to Deepseek Chat. Please log in to chat.deepseek.com in a separate tab.";
        }
        const headers = {
            'Content-Type': 'application/json',
        };
        const postData = {
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        };
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(postData)
        };
    const data = await fetchData(url, options);
    const responseData = JSON.parse(data);
    if (responseData && responseData.data && responseData.data.response) {
      return responseData.data.response;
    } else {
      console.error("DeepSeek Response:", responseData);
      return "Could not extract response from DeepSeek. Response format was unexpected.";
    }
  } catch (error) {
    console.error("DeepSeek Fetch Error:", error);
    return "Failed to get response from Deepseek: " + error.message;
  }
}


async function handleQwen(message) {
  const url = "https://chat.qwen.ai/";
  try {
        const isLoggedIn = await checkLoggedIn('https://qianwen.com');
        if (!isLoggedIn) {
             return "User not logged in to Qwen. Please log in to https://chat.qwen.ai/ in a separate tab.";
        }
        const formData = new FormData();
        formData.append("text", message);
        const options = {
            method: 'POST',
             body: formData,
        };
        const text = await fetchData(url, options);
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const responseElement = doc.querySelector('div.response-text');
         if (responseElement)
          return responseElement.textContent;
        else
          return "Could not get response from Qwen.  Website structure may have changed.";

    } catch (error) {
       console.error("Qwen Fetch Error:", error);
        return "Failed to get response from Qwen: " + error.message;
    }
}

async function handleKimi(message) {
  const url = "https://kimi.moonshot.cn/";
  try{
       const isLoggedIn = await checkLoggedIn('https://kimi.moonshot.cn');
        if (!isLoggedIn) {
             return "User not logged in to Kimi. Please log in to kimi.moonshot.cn in a separate tab.";
        }
        const formData = new FormData();
        formData.append("query", message);
        const options = {
            method: 'POST',
            body: formData
        };
        const text = await fetchData(url, options);
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const responseElement = doc.querySelector('div.answer-content');
        if(responseElement)
          return responseElement.textContent;
        else
          return "Could not get response from Kimi. Website structure may have changed.";

    } catch (error) {
        console.error("Kimi Fetch Error:", error);
        return "Failed to get response from Kimi: " + error.message;
    }
}

async function handleGemini(message) {
  const url = "https://gemini.google.com/app";
  try {
        const isLoggedIn = await checkLoggedIn('https://gemini.google.com');
        if (!isLoggedIn) {
             return "User not logged in to Gemini. Please log in to gemini.google.com in a separate tab.";
        }
        const formData = new FormData();
        formData.append("prompt", message);
        const options = {
            method: 'POST',
            body: formData,
        };
        const text = await fetchData(url, options);
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const responseElement = doc.querySelector('div.response-text');  // Example selector
         if(responseElement){
          return responseElement.textContent;
         }
         else{
           return "Could not extract response from Gemini. The website structure may have changed.";
         }

    } catch (error) {
        console.error("Gemini Fetch Error:", error);
        return "Failed to get response from Gemini: " + error.message;
    }
}

// Function to check if the user is logged in
async function checkLoggedIn(url) {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ url: url }, (cookies) => {
      // Basic check: Look for any cookies.  Improve this if possible.
      resolve(cookies && cookies.length > 0);
    });
  });
}


sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  const selectedLLM = llmSelector.value;
  if (message) {
    sendMessage(message, selectedLLM);
  }
});