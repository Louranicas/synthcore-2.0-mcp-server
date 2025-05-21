import unittest
import json
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db, User, Item

class BackendTestCase(unittest.TestCase):

    def setUp(self):
        """Set up a test client and a new database for each test."""
        app.config['TESTING'] = True
        # Use an in-memory SQLite database for testing
        # Construct the absolute path to the test database file
        # Ensuring it's different from the main dev database
        test_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'test_database.db')
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{test_db_path}'
        # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # In-memory option
        
        self.client = app.test_client()

        with app.app_context():
            db.create_all()

    def tearDown(self):
        """Ensure that the database is emptied for next unit test."""
        with app.app_context():
            db.session.remove()
            db.drop_all()
        
        test_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'test_database.db')
        if os.path.exists(test_db_path):
            os.remove(test_db_path)


    def test_01_user_registration_success(self):
        """Test successful user registration."""
        response = self.client.post('/register', json={
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'User registered successfully')
        with app.app_context():
            user = User.query.filter_by(username='testuser').first()
            self.assertIsNotNone(user)

    def test_02_user_registration_existing_user(self):
        """Test registration with an existing username."""
        # First, register a user
        self.client.post('/register', json={'username': 'testuser2', 'password': 'testpassword'})
        # Try to register the same user again
        response = self.client.post('/register', json={
            'username': 'testuser2',
            'password': 'anotherpassword'
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'User already exists')

    def test_03_user_login_success(self):
        """Test successful user login."""
        # First, register a user
        self.client.post('/register', json={'username': 'loginuser', 'password': 'loginpassword'})
        # Attempt to login
        response = self.client.post('/login', json={
            'username': 'loginuser',
            'password': 'loginpassword'
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Login successful')

    def test_04_user_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        self.client.post('/register', json={'username': 'loginuser2', 'password': 'loginpassword'})
        response = self.client.post('/login', json={
            'username': 'loginuser2',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Invalid username or password')
        
    def test_05_item_creation_success(self):
        """Test successful item creation."""
        # Register a user first
        self.client.post('/register', json={'username': 'itemuser', 'password': 'itempassword'})
        
        # The backend currently defaults to user_id=1 or first user if not provided,
        # or creates a 'default_user'. Let's ensure a user exists.
        # For more robust testing, login the user and use their token/session.
        # Here, we rely on the backend's current behavior for user_id.
        with app.app_context():
            user = User.query.filter_by(username='itemuser').first()
            self.assertIsNotNone(user, "Test setup: User 'itemuser' should exist after registration.")
            user_id_for_item = user.id

        response = self.client.post('/items', json={
            'name': 'Test Item 1',
            'description': 'This is a test item.',
            'user_id': user_id_for_item # Explicitly providing user_id
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['name'], 'Test Item 1')
        self.assertEqual(data['user_id'], user_id_for_item)
        with app.app_context():
            item = Item.query.filter_by(name='Test Item 1').first()
            self.assertIsNotNone(item)
            self.assertEqual(item.user_id, user_id_for_item)

    def test_06_get_items_empty(self):
        """Test GET /items when no items exist (integration test aspect)."""
        response = self.client.get('/items')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data, [])

    def test_07_get_items_with_data(self):
        """Test GET /items when items exist (integration test aspect)."""
        # Register a user and add an item
        self.client.post('/register', json={'username': 'itemuser2', 'password': 'password'})
        with app.app_context():
            user = User.query.filter_by(username='itemuser2').first()
            self.assertIsNotNone(user)
            user_id = user.id
        
        self.client.post('/items', json={'name': 'Item A', 'description': 'First item', 'user_id': user_id})
        self.client.post('/items', json={'name': 'Item B', 'description': 'Second item', 'user_id': user_id})

        response = self.client.get('/items')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['name'], 'Item A')
        self.assertEqual(data[1]['name'], 'Item B')

if __name__ == '__main__':
    unittest.main()
