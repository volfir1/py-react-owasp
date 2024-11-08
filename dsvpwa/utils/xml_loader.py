# utils/xml_loader.py
import os
import xml.etree.ElementTree as ET
import logging
from utils.auth import hash_password  # Changed from .auth

logger = logging.getLogger(__name__)

def find_project_root():
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    xml_path = os.path.join(current_dir, 'db', 'users.xml')
    
    if not os.path.exists(xml_path):
        logger.error(f"users.xml not found at: {xml_path}")
        raise FileNotFoundError(f"Could not find users.xml at {xml_path}")
    
    return current_dir

def load_users_from_xml():
    try:
        project_root = find_project_root()
        xml_path = os.path.join(project_root, 'db', 'users.xml')
        
        logger.debug(f"Loading XML from: {xml_path}")
        tree = ET.parse(xml_path)
        root = tree.getroot()
        
        users = []
        user_elements = root.findall('.//users/user')
        
        for user in user_elements:
            try:
                user_id = int(user.get('id'))
                username = user.find('username').text
                firstname = user.find('firstname').text
                lastname = user.find('lastname').text
                email = user.find('email').text
                password = user.find('password').text
                role = user.get('role')
                
                # Hash password before storing
                hashed_password = hash_password(password)
                
                users.append((
                    user_id,
                    username,
                    firstname,
                    lastname,
                    email,
                    hashed_password,
                    role
                ))
                
            except (TypeError, AttributeError) as e:
                logger.error(f"Error parsing user element: {e}")
                continue
            
        return users
        
    except Exception as e:
        logger.error(f"Error loading users from XML: {str(e)}")
        raise