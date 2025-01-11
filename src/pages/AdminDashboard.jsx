import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineUser } from 'react-icons/ai';
import Logout from './Logout';

function AdminDashboard() {
  const user = useSelector((state) => state.auth.user)
  console.log("User:", user);

  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSection, setSelectedSection] = useState('viewAssets');
  const [newAsset, setNewAsset] = useState({
    asset_name: '',
    description: '',
    category_id: '',
    condition: '',
    status: 'Available',
    department_id: '',
  });
  const [editingAsset, setEditingAsset] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (selectedSection === 'viewAssets' || selectedSection === 'manageAssets') {
      fetchAssets();
    }
    if (selectedSection === 'viewRequests') {
      fetchRequests();
    }
    if (selectedSection === 'manageUsers') {
      fetchUsers();
    }
  }, [selectedSection]);

  const fetchAssets = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/assets", newAsset);
      fetchAssets();
      setNewAsset({
        asset_name: "",
        description: "",
        category_id: "",
        condition: "",
        status: "Available",
        department_id: "",
      });
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/assets/${editingAsset.id}`,
        editingAsset
      );
      fetchAssets();
      setEditingAsset(null);
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  const handleDeleteAsset = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/Assets/${id}`);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/Users', newUser);
      fetchUsers();
      setNewUser({ name: '', email: '', password: '', role: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/Users/${editingUser.id}`, editingUser);
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/Users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/Requests/${id}`, { status_id: 2 });
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/Requests/${id}`, { status_id: 3 });
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const closeModal = () => {
    setEditingAsset(null);
  };

  return (
    <div style={styles.adminDashboard}>
      <div style={styles.sidebar}>
      <div style={styles.userInfo}>
        <AiOutlineUser style={styles.userIcon} />
        <strong>{user ? user.username : 'Loading...'}</strong> {/* Add a fallback text or loading message */}
      </div>

        <h2 style={styles.sidebarTitle}>Administ Dashboard</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem} onClick={() => handleSectionChange('viewAssets')}>View All Assets</li>
          <li style={styles.navItem} onClick={() => handleSectionChange('viewRequests')}>View Requests</li>
          <li style={styles.navItem} onClick={() => handleSectionChange('manageAssets')}>Manage Assets</li>
          <li style={styles.navItem} onClick={() => handleSectionChange('manageUsers')}>Manage Users</li>
        </ul>
        <Logout />
      </div>

      <div style={styles.content}>
        <h1 style={styles.contentTitle}>Administra Dashboard</h1>

        {/* View Assets Section */}
        {selectedSection === 'viewAssets' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>All Assets</h2>
            <div style={styles.assetGrid}>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <div key={asset.id} style={styles.assetCard}>
                    <img src={asset.image_url} alt={asset.asset_name} style={styles.assetImage} />
                    <h4>{asset.asset_name}</h4>
                    <p>{asset.description}</p>
                    <span>Status: {asset.status}</span>
                    <div style={styles.buttonContainer}>
                      <button onClick={() => handleEditAsset(asset)} style={styles.editButton}>Edit</button>
                      <button onClick={() => handleDeleteAsset(asset.id)} style={styles.deleteButton}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No assets available to display at the moment.</p>
              )}
            </div>
          </div>
        )}

        {/* Edit Asset Modal */}
        {editingAsset && (
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Asset</h2>
              <button onClick={closeModal} style={styles.closeButton}>X</button>
            </div>
            <form onSubmit={handleUpdateAsset} style={styles.form}>
              <input
                type="text"
                placeholder="Asset Name"
                value={editingAsset.asset_name}
                onChange={(e) =>
                  setEditingAsset({ ...editingAsset, asset_name: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Description"
                value={editingAsset.description}
                onChange={(e) =>
                  setEditingAsset({ ...editingAsset, description: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Category ID"
                value={editingAsset.category_id}
                onChange={(e) =>
                  setEditingAsset({ ...editingAsset, category_id: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Condition"
                value={editingAsset.condition}
                onChange={(e) =>
                  setEditingAsset({ ...editingAsset, condition: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Department ID"
                value={editingAsset.department_id}
                onChange={(e) =>
                  setEditingAsset({ ...editingAsset, department_id: e.target.value })
                }
                style={styles.input}
              />
              <button type="submit" style={styles.submitButton}>
                Update Asset
              </button>
            </form>
          </div>
        )}

        {/* View Requests Section */}
        {selectedSection === 'viewRequests' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>User Requests</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Request Type</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Urgency</th>
                  <th style={styles.tableHeader}>Reason</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td style={styles.tableCell}>{request.request_type}</td>
                    <td style={styles.tableCell}>{request.quantity}</td>
                    <td style={styles.tableCell}>{request.urgency}</td>
                    <td style={styles.tableCell}>{request.reason}</td>
                    <td style={styles.tableCell}>
                      {request.status_id === 1 ? 'Pending' : request.status_id === 2 ? 'Approved' : 'Rejected'}
                    </td>
                    <td style={styles.tableCell}>
                      {request.status_id === 1 && (
                        <>
                          <button onClick={() => handleApprove(request.id)} style={styles.approveButton}>Approve</button>
                          <button onClick={() => handleReject(request.id)} style={styles.rejectButton}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manage Assets Section */}
        {selectedSection === 'manageAssets' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
            <form onSubmit={editingAsset ? handleUpdateAsset : handleAddAsset} style={styles.form}>
              <input
                type="text"
                placeholder="Asset Name"
                value={editingAsset ? editingAsset.asset_name : newAsset.asset_name}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, asset_name: e.target.value })
                    : setNewAsset({ ...newAsset, asset_name: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Description"
                value={editingAsset ? editingAsset.description : newAsset.description}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, description: e.target.value })
                    : setNewAsset({ ...newAsset, description: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Category ID"
                value={editingAsset ? editingAsset.category_id : newAsset.category_id}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, category_id: e.target.value })
                    : setNewAsset({ ...newAsset, category_id: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Condition"
                value={editingAsset ? editingAsset.condition : newAsset.condition}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, condition: e.target.value })
                    : setNewAsset({ ...newAsset, condition: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Department ID"
                value={editingAsset ? editingAsset.department_id : newAsset.department_id}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, department_id: e.target.value })
                    : setNewAsset({ ...newAsset, department_id: e.target.value })
                }
                style={styles.input}
              />
              <button type="submit" style={styles.submitButton}>
                {editingAsset ? 'Update Asset' : 'Add Asset'}
              </button>
            </form>

            <h2 style={styles.sectionTitle}>All Assets</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Description</th>
                  <th style={styles.tableHeader}>Condition</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td style={styles.tableCell}>{asset.asset_name}</td>
                    <td style={styles.tableCell}>{asset.description}</td>
                    <td style={styles.tableCell}>{asset.condition}</td>
                    <td style={styles.tableCell}>
                      <button onClick={() => handleEditAsset(asset)} style={styles.approveButton}>Edit</button>
                      <button onClick={() => handleDeleteAsset(asset.id)} style={styles.rejectButton}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manage Users Section */}
        {selectedSection === 'manageUsers' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} style={styles.form}>
              <input
                type="text"
                placeholder="Name"
                value={editingUser ? editingUser.name : newUser.name}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, name: e.target.value })
                    : setNewUser({ ...newUser, name: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={editingUser ? editingUser.email : newUser.email}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, email: e.target.value })
                    : setNewUser({ ...newUser, email: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={editingUser ? editingUser.password : newUser.password}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, password: e.target.value })
                    : setNewUser({ ...newUser, password: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Role"
                value={editingUser ? editingUser.role : newUser.role}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, role: e.target.value })
                    : setNewUser({ ...newUser, role: e.target.value })
                }
                style={styles.input}
              />
              <button type="submit" style={styles.submitButton}>
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </form>

            <h2 style={styles.sectionTitle}>All Users</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Role</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={styles.tableCell}>{user.name}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>{user.role}</td>
                    <td style={styles.tableCell}>
                      <button onClick={() => handleEditUser(user)} style={styles.approveButton}>Edit</button>
                      <button onClick={() => handleDeleteUser(user.id)} style={styles.rejectButton}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  adminDashboard: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f6f8',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#ecf0f1',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '20px',
  },
  navItem: {
    padding: '10px 0',
    cursor: 'pointer',
    color: '#bdc3c7',
    transition: 'color 0.2s',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    alignSelf: 'center',
    marginTop: '20px',
  },
  content: {
    flexGrow: 1,
    padding: '20px',
  },
  contentTitle: {
    color: '#34495e',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  section: {
    backgroundColor: '#ecf0f1',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  assetGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  assetCard: {
    width: '200px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  assetImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    width: '400px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '20px',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
  },
  approveButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejectButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  userInfo: {
    position: 'absolute',
    top: '30px', // 20px from top of the page
    right: '20px', // 20px from the right of the page
    backgroundColor: '#A9DFBF', // Light green background
    color: '#2C3E50', // Blue color for the text
    fontWeight: 'bold',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 10, // Ensure it stays on top of other content
  },
  userIcon: {
    fontSize: '30px', // Increase icon size
  }
};

export default AdminDashboard;

