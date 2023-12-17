import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DataTable.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    let result = data;

    Object.entries(filters).forEach(([key, value]) => {
      result = result.filter((item) =>
        item[key].toString().toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredData(result);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortKey] || ''; // Handle undefined or null values
    const bValue = b[sortKey] || ''; // Handle undefined or null values
  
    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const renderTableHeader = () => {
    if (!data || data.length === 0) {
      return null; // or handle the case when data is empty
    }
  
    return (
      <tr>
        {Object.keys(data[0]).map((key) => (
          <th key={key}>
            {key}
            <input
              type="text"
              placeholder={`Filter ${key}`}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
          </th>
        ))}
      </tr>
    );
  };
  
  const renderTableData = () => {
    return currentItems.map((item) => (
      <tr key={item.id}>
        {Object.values(item).map((value) => (
          <td key={value}>{value}</td>
        ))}
      </tr>
    ));
  };

  const renderPagination = () => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(sortedData.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <ul>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button onClick={() => setCurrentPage(number)}>{number}</button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <table>
        <thead>{renderTableHeader()}</thead>
        <tbody>{renderTableData()}</tbody>
      </table>
      <div>{renderPagination()}</div>
    </div>
  );
};

export default DataTable;
