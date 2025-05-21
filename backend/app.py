from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)

# Database Configuration
# Construct the absolute path to the database file
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'database', 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-key' # Change this in a real application!

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # Assuming items are owned by users
    user = db.relationship('User', backref=db.backref('items', lazy=True))


    def __repr__(self):
        return f'<Item {self.name}>'

@app.route('/')
def home():
    return "Hello from Flask!"

# --- User Authentication Routes ---
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'User already exists'}), 400
        
    new_user = User(username=data['username'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

# For login, we'll need a session or token mechanism later. For now, just check credentials.
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400
        
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        # In a real app, you'd create a session or JWT token here
        return jsonify({'message': 'Login successful'}), 200
    
    return jsonify({'message': 'Invalid username or password'}), 401

# --- Item CRUD Routes ---
# For simplicity, these routes are not protected by authentication yet.

@app.route('/items', methods=['POST'])
def create_item():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'message': 'Item name is required'}), 400
    
    # In a real app, you'd get user_id from the authenticated user's session/token
    # For now, let's assume a user_id is provided or defaults to a test user.
    # This needs to be improved once proper auth is in place.
    user_id = data.get('user_id') 
    if not user_id:
        # Fallback: try to get the first user or create one if none exist
        user = User.query.first()
        if not user:
            # This is a fallback, ideally registration should happen first
            user = User(username='default_user')
            user.set_password('password') # Set a default password
            db.session.add(user)
            db.session.commit() # Commit the new user
        user_id = user.id


    new_item = Item(name=data['name'], description=data.get('description'), user_id=user_id)
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'id': new_item.id, 'name': new_item.name, 'description': new_item.description, 'user_id': new_item.user_id}), 201

@app.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([{'id': item.id, 'name': item.name, 'description': item.description, 'user_id': item.user_id} for item in items]), 200

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = Item.query.get_or_404(item_id)
    return jsonify({'id': item.id, 'name': item.name, 'description': item.description, 'user_id': item.user_id}), 200

@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    item = Item.query.get_or_404(item_id)
    data = request.get_json()
    
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    # user_id update is not typically done this way, usually handled by ownership logic
    
    db.session.commit()
    return jsonify({'id': item.id, 'name': item.name, 'description': item.description, 'user_id': item.user_id}), 200

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create database tables if they don't exist
    app.run(debug=True, port=5001) # Changed port to 5001 to avoid conflict if React runs on 5000 later
