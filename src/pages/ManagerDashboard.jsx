import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from "react-csv";
import { useSelector } from 'react-redux';
import { AiOutlineUser } from 'react-icons/ai';

function ProcManagerDashboard() {
  const user = useSelector((state) => state.auth.user)
  console.log("User:", user);

  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
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

  const [sortCriteria, setSortCriteria] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (selectedSection === 'viewAssets' || selectedSection === 'manageAssets') {
      fetchAssets();
    }
    if (selectedSection === 'viewRequests') {
      fetchRequests();
    }
  }, [selectedSection, sortCriteria, categoryFilter, statusFilter]);

  const fetchAssets = async () => {
    try {
      let response = await axios.get('http://localhost:3000/Assets');
      let filteredAssets = response.data;

      // Apply category filter
      if (categoryFilter) {
        filteredAssets = filteredAssets.filter(asset => asset.category_id === categoryFilter);
      }

      // Apply status filter
      if (statusFilter) {
        filteredAssets = filteredAssets.filter(asset => asset.status === statusFilter);
      }

      // Apply sorting
      if (sortCriteria) {
        filteredAssets = filteredAssets.sort((a, b) => {
          if (sortCriteria === 'name') {
            return a.asset_name.localeCompare(b.asset_name);
          } else if (sortCriteria === 'condition') {
            return a.condition.localeCompare(b.condition);
          } else if (sortCriteria === 'status') {
            return a.status.localeCompare(b.status);
          }
          return 0;
        });
      }

      setAssets(filteredAssets);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Requests');
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const csvData = assets.map(asset => ({
    Asset_Name: asset.asset_name,
    Description: asset.description,
    Category: asset.category_id,
    Status: asset.status,
    Condition: asset.condition,
    Department: asset.department_id,
  }));

  return (
    <div style={styles.adminDashboard}>
      <div style={styles.sidebar}>
      <div style={styles.userInfo}>
        <AiOutlineUser style={styles.userIcon} />
        <strong>{user.username}</strong>
      </div> 
        <h2 style={styles.sidebarTitle}> procurement Manager Dashboard</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem} onClick={() => handleSectionChange('viewAssets')}>View All Assets</li>
          <li style={styles.navItem} onClick={() => handleSectionChange('viewRequests')}>View Requests</li>
          <li style={styles.navItem} onClick={() => handleSectionChange('manageAssets')}>Manage Assets</li>
          <li style={styles.navItem}>
            <CSVLink data={csvData} filename={"assets_report.csv"} style={styles.downloadLink}>Download Report</CSVLink>
          </li>
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.content}>
        <h1 style={styles.contentTitle}>Procure Manager Dashboard</h1>

        {selectedSection === 'viewAssets' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>All Assets</h2>

            <div style={styles.filterContainer}>
              <select
                style={styles.select}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
                {/* Add other categories here */}
              </select>
              <select
                style={styles.select}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
                {/* Add other statuses here */}
              </select>
              <select
                style={styles.select}
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="condition">Condition</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div style={styles.assetGrid}>
              {assets.length > 0 ? (
                assets.map(asset => (
                  <div key={asset.id} style={styles.assetCard}>
                    <img src={asset.image_url} alt={asset.asset_name} style={styles.assetImage} />
                    <h4>{asset.asset_name}</h4>
                    <p>{asset.description}</p>
                    <span>Status: {asset.status}</span>
                  </div>
                ))
              ) : (
                <p>No assets available to display.</p>
              )}
            </div>
          </div>
        )}

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
                    <td style={styles.tableCell}>{request.status_id === 1 ? "Pending" : request.status_id === 2 ? "Approved" : "Rejected"}</td>
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

        {selectedSection === 'manageAssets' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{editingAsset ? "Edit Asset" : "Add New Asset"}</h2>
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
              <select
                value={editingAsset ? editingAsset.status : newAsset.status}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, status: e.target.value })
                    : setNewAsset({ ...newAsset, status: e.target.value })
                }
                style={styles.select}
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              <button type="submit" style={styles.submitButton}>
                {editingAsset ? 'Update Asset' : 'Add Asset'}</button>
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
                {editingAsset ? "Update Asset" : "Add Asset"}
              </button>
            </form>
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
    fontSize: '24px',
    marginBottom: '20px',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
  },
  navItem: {
    marginBottom: '10px',
    cursor: 'pointer',
  },
  downloadLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '5px',
    backgroundColor: '#007bff',
    borderRadius: '4px',
  },
  logoutButton: {
    marginTop: 'auto',
    padding: '10px 15px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
  contentTitle: {
    fontSize: '32px',
    marginBottom: '20px',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '15px',
  },
  filterContainer: {
    marginBottom: '15px',
    display: 'flex',
    gap: '10px',
  },
  select: {
    padding: '8px',
    fontSize: '16px',
  },
  assetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  assetCard: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  assetImage: {
    width: '100%',
    height: 'auto',
    marginBottom: '20px',
  },
  navItem: {
    padding: '10px 0',
    cursor: 'pointer',
    color: '#bdc3c7',
    transition: 'color 0.2s',
  },
  downloadLink: {
    color: '#3498db',
    textDecoration: 'none',
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    textAlign: 'left',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'left',
  },
  approveButton: {
    padding: '5px 10px',
    marginTop: '10px',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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

export default ProcManagerDashboard;
