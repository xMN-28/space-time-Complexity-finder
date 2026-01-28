from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def analyze_complexity(code: str, language: str = "auto") -> dict:
    """
    Analyze the time and space complexity of the given code using OpenAI's GPT.
    """
    system_prompt = """You are an expert algorithm analyst. Your task is to analyze code and determine its time and space complexity.

You must respond in valid JSON format with the following structure:
{
    "time_complexity": {
        "notation": "O(...)",
        "explanation": "Brief explanation of why this is the time complexity"
    },
    "space_complexity": {
        "notation": "O(...)",
        "explanation": "Brief explanation of why this is the space complexity"
    },
    "summary": "A brief 1-2 sentence summary of what the code does",
    "suggestions": "Optional suggestions for optimization (if any)"
}

Be precise and educational in your explanations. If the code has multiple functions, analyze the main/overall complexity.
If the code is invalid or you cannot determine the complexity, still return the JSON structure but explain the issue in the explanations."""

    user_prompt = f"""Analyze the following code and determine its time and space complexity.

Language: {language}

Code:
```
{code}
```

Respond only with valid JSON."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Try to parse the JSON response
        # Handle cases where the response might be wrapped in markdown code blocks
        if result_text.startswith("```"):
            lines = result_text.split("\n")
            result_text = "\n".join(lines[1:-1])
        
        result = json.loads(result_text)
        return {"success": True, "data": result}
    
    except json.JSONDecodeError as e:
        return {
            "success": False, 
            "error": "Failed to parse analysis results. Please try again.",
            "raw_response": result_text if 'result_text' in locals() else None
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.route('/')
def index():
    """Serve the main page."""
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    """API endpoint to analyze code complexity."""
    data = request.get_json()
    
    if not data or 'code' not in data:
        return jsonify({"success": False, "error": "No code provided"}), 400
    
    code = data.get('code', '').strip()
    language = data.get('language', 'auto')
    
    if not code:
        return jsonify({"success": False, "error": "Code cannot be empty"}), 400
    
    if len(code) > 10000:
        return jsonify({"success": False, "error": "Code is too long. Maximum 10,000 characters allowed."}), 400
    
    result = analyze_complexity(code, language)
    return jsonify(result)


@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy"})


if __name__ == '__main__':
    # Check if API key is configured
    if not os.getenv('OPENAI_API_KEY'):
        print("\n⚠️  Warning: OPENAI_API_KEY not found in environment variables!")
        print("Please create a .env file with your OpenAI API key.")
        print("You can copy .env.example to .env and add your key.\n")
    
    app.run(debug=True, port=5000)
