import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineUser } from "react-icons/ai";
import { useSelector } from 'react-redux';

function UserDashboard() {
  const user = useSelector((state) => state.auth.user)
  // console.log("User:", user);
  
  const [assetType, setAssetType] = useState('');
  const [requestType, setRequestType] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('Pending');
  const [createdAt, setCreatedAt] = useState('');
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [activeSection, setActiveSection] = useState('viewRequests');
  const [assetNameFilter, setAssetNameFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'asset_name', direction: 'asc' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentTimestamp = new Date().toISOString();
    setCreatedAt(currentTimestamp);

    const fetchData = async () => {
      try {
        const [assetsResponse, requestsResponse] = await Promise.all([
          axios.get('http://localhost:3000/Assets'),
          axios.get('http://localhost:3000/Requests'),
        ]);

        setAssets(assetsResponse.data);
        setRequests(requestsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRequest = {
      id: requests.length + 1,
      request_type: requestType,
      quantity,
      urgency,
      reason,
      status,
      created_at: createdAt,
    };

    try {
      await axios.post('http://localhost:3000/Requests', newRequest);
      setRequests([...requests, newRequest]);
      handleCancel();
      setActiveSection('viewRequests');
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleCancel = () => {
    setAssetType('');
    setRequestType('');
    setRequestedBy('');
    setQuantity('');
    setUrgency('');
    setReason('');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAssets = assets.filter(asset =>
    asset.asset_name.toLowerCase().includes(assetNameFilter.toLowerCase())
  );

  const sortedAssets = filteredAssets.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
       <div style={styles.userInfo}>
        <AiOutlineUser style={styles.userIcon} />
        <strong>{user.username}</strong>
      </div> 
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>User Dashboard</h2>

        <ul style={styles.navList}>
          <li style={styles.navItem} onClick={() => setActiveSection('viewRequests')}>
            View My Requests
          </li>
          <li style={styles.navItem} onClick={() => setActiveSection('viewAssets')}>
            View All Assets
          </li>
          <li style={styles.navItem} onClick={() => setActiveSection('viewMyAssets')}>
            View My Assets
          </li>
          <li style={styles.navItem} onClick={() => setActiveSection('makeRequest')}>
            Make a New Request
          </li>
          <li style={styles.navItem} onClick={() => setActiveSection('viewProfile')}>
            View Profile
          </li>

          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </ul>
      </div>

      <div style={styles.content}>
        <h1>User Dashboard</h1>

        {activeSection === 'viewRequests' ? (
          <div style={styles.tableContainer}>
            <h2>My Requests</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Type</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Urgency</th>
                  <th style={styles.tableHeader}>Reason</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td style={styles.tableCell}>{request.request_type}</td>
                    <td style={styles.tableCell}>{request.quantity}</td>
                    <td style={styles.tableCell}>{request.urgency}</td>
                    <td style={styles.tableCell}>{request.reason}</td>
                    <td style={styles.tableCell}>{request.status}</td>
                    <td style={styles.tableCell}>{new Date(request.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeSection === 'viewProfile' ? (
          <div style={styles.profileContainer}>
            <div style={styles.profileHeader}>
              <div style={styles.imagePlaceholder}>
                <label style={styles.imageText}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" style={styles.profileImage} />
                  ) : (
                    <span>Add Photo</span>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageFileChange} style={styles.fileInput} />
                </label>
              </div>
            </div>
        
            <div style={styles.profileInfoContainer}>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Department ID:</strong> {user.department_id}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Account Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleDateString()}</p>
        
              <div style={styles.passwordSection}>
                <strong>Password: </strong>
                <span>
                  {isPasswordVisible ? user.password : '••••••••••'}
                </span>
                <button 
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                  style={styles.passwordToggleButton}
                >
                  {isPasswordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        ) : activeSection === 'viewAssets' ? (
          <div style={styles.assetContainer}>
            <h2>All Assets</h2>
            <input
              type="text"
              placeholder="Filter by asset name"
              value={assetNameFilter}
              onChange={(e) => setAssetNameFilter(e.target.value)}
              style={styles.input}
            />
            {assets.length > 0 ? (
              <ul style={styles.assetList}>
                <li style={styles.assetItem}>
                  <span onClick={() => handleSort('asset_name')} style={styles.sortableHeader}>Asset Name</span>
                  <span onClick={() => handleSort('status')} style={styles.sortableHeader}>Status</span>
                </li>
                {sortedAssets.map(asset => (
                  <li key={asset.id} style={styles.assetItem}>
                    <img src={asset.image_url} alt={asset.asset_name} style={styles.assetImage} />
                    <h4>{asset.asset_name}</h4>
                    <p>{asset.description}</p>
                    <span>Status: {asset.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No assets available.</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2>Create Request</h2>
            <label style={styles.label}>Asset Type</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              style={styles.input}
            >
              <option value="">Select Asset Type</option>
              <option value="Laptop">Laptop</option>
              <option value="Chair">Chair</option>
              <option value="Table">Table</option>
              <option value="Projector">Projector</option>
            </select>

            <label style={styles.label}>Request Type</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              style={styles.input}
            >
              <option value="">Select Request Type</option>
              <option value="New Asset">New Asset</option>
              <option value="Repair">Repair</option>
            </select>

            <label style={styles.label}>Requested By (Department)</label>
            <select
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              style={styles.input}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>

            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              style={styles.input}
            >
              <option value="">Select Urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label style={styles.label}>Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Status</label>
            <input
              type="text"
              value={status}
              readOnly
              style={styles.input}
            />

            <label style={styles.label}>Created At</label>
            <input
              type="text"
              value={createdAt}
              readOnly
              style={styles.input}
            />

            <div style={styles.formButtons}>
              <button type="submit" style={styles.submitButton}>Submit</button>
              <button type="button" onClick={handleCancel} style={styles.cancelButton}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
    
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2C3E50',
    padding: '20px',
    color: '#ECF0F1',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  navItem: {
    cursor: 'pointer',
    padding: '10px 0',
    fontSize: '18px',
    color: '#bdc3c7',   
    transition: 'color 0.2s',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  content: {
    flexGrow: 1,
    padding: '20px',
  },
  
  assetContainer: {
    backgroundColor: '#2C3E50',
    padding: '20px',
    borderRadius: '10px',
    color: '#ECF0F1',
  },
  assetList: {
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: 0,
  },
  assetItem: {
    width: '150px',
    padding: '10px',
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: '5px',
    textAlign: 'center',
  },
  assetImage: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
  },
  form: {
    backgroundColor: '#2C3E50',
    padding: '20px',
    borderRadius: '10px',
    color: '#ECF0F1',
  },
  tableContainer: {
    backgroundColor: '#2C3E50',
    padding: '20px',
    borderRadius: '10px',
    color: '#ECF0F1',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#34495e',
    color: '#ECF0F1',
    padding: '10px',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #34495e',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  userInfo: {
    position: 'absolute',
    top: '40px', // 20px from top of the page
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
  },
  profileContainer: {
    backgroundColor: '#34495e',
    padding: '60px',
    borderRadius: '7px',
    color: '#ECF0F1',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  imagePlaceholder: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: '#95a5a6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ecf0f1',
    fontSize: '14px',
    fontWeight: 'bold',
    position: 'relative',
    overflow: 'hidden', // Ensure the image fits inside the circle
  },
  imageText: {
    color: '#fff',
    cursor: 'pointer',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the image fits the circular area
  },
  fileInput: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    opacity: '0',
    cursor: 'pointer',
  },
  profileInfoContainer: {
    marginTop: '50px',
    marginBottom: '50px',
  },
  passwordSection: {
    marginTop: '50px',
    marginBottom: '50px',
  },
  passwordToggleButton: {
    padding: '5px 10px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }};

export default UserDashboard;
