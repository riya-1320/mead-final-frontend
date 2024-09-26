import React, { useEffect, useState } from 'react';
import './user.css'; // Ensure you have a CSS file for styles
import axios from 'axios'; // Import axios for making API requests
import { ToastContainer, toast } from 'react-toastify'; // Import toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', role: '' });
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'User', password: '' }); // New user data state

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://13.202.225.45:5000/api/components/user/alluser', {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'), // Get token from localStorage and send it in the request
        },
      });
      setUsers(response.data);
    } catch (error) {
      if(error.response && error.response.status === 401) {
        navigate('/');
      }
      console.error('Error fetching users:', error);
      toast.error(error.response?.data.msg || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://13.202.225.45:5000/api/components/user/${id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setUsers(users.filter((user) => user._id !== id)); // Update users after deletion
        toast.success('User deleted successfully!'); // Notify success
      } catch (error) {
        if(error.response && error.response.status === 401) {
          navigate('/');
        }
        console.error('Failed to delete user:', error);
        toast.error(error.response?.data.msg || 'Failed to delete user');
      }
    }
  };

  // Handle update user
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://13.202.225.45:5000/api/components/user/${editingUser}`,
        userData,
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      setEditingUser(null); // Reset editing mode
      setUserData({ name: '', email: '', role: '' }); // Clear the input fields
      fetchUsers(); // Refresh users after update
      toast.success('User updated successfully!'); // Notify success
    } catch (error) {
      if(error.response && error.response.status === 401) {
        navigate('/');
      }
      console.error('Failed to update user:', error);
      const { response } = error;
      if (response && response.data && response.data.errors) {
        const errorMessages = response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation failed: ${errorMessages}`); // Set combined error messages
      } else {
        toast.error('Failed to update user');
      }
    }
  };

  // Handle adding a new user
  const handleAddUser = async () => {
    try {
      await axios.post(
        'http://13.202.225.45:5000/api/components/register',
        newUserData,
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      setNewUserData({ name: '', email: '', role: 'User', password: '' }); // Reset new user data
      setShowModal(false); // Close modal
      fetchUsers(); // Refresh users after adding
      toast.success('User added successfully!'); // Notify success
    } catch (error) {
      if(error.response && error.response.status === 401) {
        navigate('/');
      }
      console.error('Failed to add user:', error);
      const { response } = error;
      if (response && response.data && response.data.errors) {
        const errorMessages = response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation failed: ${errorMessages}`); // Set combined error messages
      } else {
        toast.error('Failed to add user');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users on component mount

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setUserData({ name: user.name, email: user.email, role: user.role });
  };

  return (
    <div className="us-users-container">
      <div className="us-users-header">
        <h1 className="us-users-title">Users</h1>
        <button className="us-add-user-button" onClick={() => setShowModal(true)}>Add User</button>
      </div>

      {loading ? (
        <p className="us-loading-text">Loading...</p>
      ) : (
        <div className="us-table-container">
          {users.length === 0 ? (
            <p className="us-no-users">No users available.</p>
          ) : (
            <table className="us-users-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>
                      {editingUser === user._id ? (
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          className="us-input"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingUser === user._id ? (
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          className="us-input"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUser === user._id ? (
                        <select
                          value={userData.role}
                          onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                          className="us-input"
                        >
                          <option value="Admin">Admin</option>
                          <option value="User">User</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td>{new Date(user.date).toLocaleDateString()}</td>
                    <td>
                      {editingUser === user._id ? (
                        <>
                          <button className="us-save-button" onClick={handleUpdate}>Save</button>
                          <button className="usad-cancel-button" onClick={() => setEditingUser(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="us-edit-button" onClick={() => handleEdit(user)}>Edit</button>
                          <button className="us-delete-button" onClick={() => handleDelete(user._id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal for Adding New User */}
      {showModal && (
        <div className="usad-modal">
          <div className="usad-modal-content">
            <h2>Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              value={newUserData.name}
              onChange={(e) =>
                setNewUserData({ ...newUserData, name: e.target.value })
              }
              className="usad-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              className="usad-input"
            />
            <select
              value={newUserData.role}
              onChange={(e) =>
                setNewUserData({ ...newUserData, role: e.target.value })
              }
              className="usad-input"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData({ ...newUserData, password: e.target.value })
              }
              className="usad-input"
            />
            <button className="usad-submit-button" onClick={handleAddUser}>Add User</button>
            <button className="usad-cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover /> {/* ToastContainer for notifications */}
    </div>
  );
};

export default Users;
