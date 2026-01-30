# Code Complexity Analyzer

A beautiful web application that analyzes the time and space complexity of your code using OpenAI's GPT API.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)

## Features

- **Instant Complexity Analysis**: Get Big O notation for both time and space complexity
- **Multi-Language Support**: Supports Python, JavaScript, Java, C++, and many more
- **Detailed Explanations**: Understand why your code has a certain complexity
- **Optimization Suggestions**: Get tips on how to improve your code
- **Modern UI**: Beautiful dark theme with smooth animations

![image alt](https://github.com/xMN-28/space-time-Complexity-finder/blob/5c912ffa079eadbee1fe92f1e444311e409beeec/code-complexity-ss.jpeg)

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Your OpenAI API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=your_actual_api_key_here
```

> Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Run the Application

```bash
python app.py
```

### 4. Open in Browser

Navigate to [http://localhost:5000](http://localhost:5000)

## Usage

1. Paste your code into the editor
2. (Optional) Select the programming language for better analysis
3. Click "Analyze Complexity" or press `Ctrl/Cmd + Enter`
4. View the results with detailed explanations

## Project Structure

```
space-time-Complexity-finder/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variable template
├── .env                  # Your API key (create this)
├── README.md             # This file
├── static/
│   └── js/
│       └── main.js       # Frontend JavaScript
└── templates/
    └── index.html        # Main HTML page
```

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML, Tailwind CSS, JavaScript
- **AI**: OpenAI GPT-3.5-turbo

## License

MIT License - feel free to use this project for learning and personal use.
