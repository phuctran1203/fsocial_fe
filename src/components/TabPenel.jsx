const TabPanel= ({ tabs, defaultTabId, ulClassName, activeClassName, inactiveClassName, contentClassName }) => {
    const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0].id);
  
    const handleTabClick = (tabId) => {
      setActiveTab(tabId);
    };
  
    return (
      <>
        <div className="mb-1">
          <ul className={` ${ulClassName || 'flex flex-wrap text-sm font-medium text-start sm:text-center'}`} role="tablist" >
            {tabs.map((tab) => (
              <li key={tab.id} className="border shadow-md rounded sm:round-none sm:shadow-none sm:border-0 w-full sm:w-auto m-0 sm:mr-2" role="presentation">
                <button
                  className={`inline-block p-2 rounded-t-lg ${activeTab === tab.id
                    ? activeClassName
                    : inactiveClassName
                    }`}
                  id={`${tab.id}-tab`}
                  type="button"
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {tabs.map((tab) => (
  
            <div
              key={tab.id}
              className={`${contentClassName ?? ' px-5 py-3 border dark:border-gray-900 my-4 border-gray-100 rounded-lg shadow-lg ' }  ${activeTab === tab.id ? '' : 'hidden'
                }`}
              id={tab.id}
              role="tabpanel"
              aria-labelledby={`${tab.id}-tab`}
            >
              {activeTab === tab.id &&
                <div>
                  {tab.content}
                </div>
              }
            </div>
          ))}
        </div>
      </>
    );
  };
  
  export default TabPanel;