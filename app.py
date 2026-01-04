from flask import Flask, render_template, request, jsonify
import random
import string

app = Flask(__name__)

def generate_password(length=12, use_uppercase=True, use_lowercase=True, 
                      use_digits=True, use_symbols=False, exclude_ambiguous=False):
    """
    Generate a random password with customizable options.
    
    Args:
        length (int): Length of the password
        use_uppercase (bool): Include uppercase letters
        use_lowercase (bool): Include lowercase letters
        use_digits (bool): Include digits
        use_symbols (bool): Include symbols
        exclude_ambiguous (bool): Exclude ambiguous characters (0, O, l, 1, etc.)
    
    Returns:
        str: Generated password
    """

    chars = ""
    if use_uppercase:
        chars += string.ascii_uppercase
    if use_lowercase:
        chars += string.ascii_lowercase
    if use_digits:
        chars += string.digits
    if use_symbols:
        chars += "!@#$%^&*"

    if exclude_ambiguous:
        ambiguous = "0O1lI"
        chars = ''.join(c for c in chars if c not in ambiguous)

    if not chars:
        raise ValueError("At least one character type must be selected")

    return ''.join(random.choice(chars) for _ in range(length))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    
    try:
        length = int(data.get('length', 12))
        use_uppercase = data.get('uppercase', True)
        use_lowercase = data.get('lowercase', True)
        use_digits = data.get('numbers', True)
        use_symbols = data.get('symbols', False)
        exclude_ambiguous = data.get('exclude_ambiguous', False)
        
        password = generate_password(
            length=length,
            use_uppercase=use_uppercase,
            use_lowercase=use_lowercase,
            use_digits=use_digits,
            use_symbols=use_symbols,
            exclude_ambiguous=exclude_ambiguous
        )
        
        return jsonify({'password': password})
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)