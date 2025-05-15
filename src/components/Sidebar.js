import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#B38BFA");
  const [groups, setGroups] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    setGroups(savedGroups);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileSidebarOpen &&
        !e.target.closest(`.${styles.sidebar}`) &&
        !e.target.closest(`.${styles['mobile-menu-button']}`)
      ) {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileSidebarOpen]);

  const handleCreateGroup = () => {
    if (groupName.trim() === "") return;

    const newGroup = {
      id: Date.now(),
      name: groupName,
      color: selectedColor,
      notes: [],
      createdAt: new Date().toISOString()
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    
    setGroupName("");
    setSelectedColor("#B38BFA");
    setShowModal(false);
    navigate(`/notes/${newGroup.id}`);
  };

  const colorOptions = [
    "#B38BFA", "#FF79F2", "#43E6FC", 
    "#F19576", "#0047FF", "#6691FF"
  ];

  return (
    <>
      {!mobileSidebarOpen && (
        <button 
          className={styles['mobile-menu-button']}
          onClick={() => setMobileSidebarOpen(true)}
        >
          <FaBars />
        </button>
      )}

      <div className={`${styles.sidebar} ${mobileSidebarOpen ? styles['mobile-open'] : ''}`}>
        <h1 className={styles['sidebar-title']}><Link to="/" style={{textDecoration:"none", color:"inherit"}} >Pocket Notes</Link></h1>
        
        <div className={styles['groups-list']}>
          {groups.map(group => (
            <div 
              key={group.id} 
              className={styles['group-item']}
              onClick={() => navigate(`/notes/${group.id}`)}
            >
              <div 
                className={styles['group-avatar']} 
                style={{ backgroundColor: group.color }}
              >
                {group.name.split(' ').map(w => w[0]).join('').toUpperCase()}
              </div>
              <span className={styles['group-name']}>{group.name}</span>
            </div>
          ))}

          <div 
            className={`${styles['group-item']} ${styles['add-new-group']}`} 
            onClick={() => setShowModal(true)}
          >
            <div 
              className={styles['group-avatar']} 
              style={{ backgroundColor: '#16008B' }}
            >
              +
            </div>
          </div>
        </div>

        {showModal && (
          <div className={styles['modal-overlay']}>
            <div className={styles['create-group-modal']}>
              <button 
                className={styles['modal-close-button']}
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>

              <h2>Create New group</h2>
              <div className={styles['input-group']}>
                <label>Group Name</label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              
              <div className={styles['color-group']}>
                <label>Choose colour</label>
                <div className={styles['color-options']}>
                  {colorOptions.map(color => (
                    <div
                      key={color}
                      className={`${styles['color-option']} ${selectedColor === color ? styles['selected'] : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              <button className={styles['create-button']} onClick={handleCreateGroup}>
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
