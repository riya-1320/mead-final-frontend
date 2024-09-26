import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './userquotation.css'; // Updated CSS

const Userquotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const navigate = useNavigate();
  const username = localStorage.getItem('user');

  useEffect(() => {
    const fetchQuotationsByUsername = async () => {
      try {
        const response = await axios.get('http://13.202.225.45:5000/api/components/combine/getFurnitureDetailByUsername', {
          params: { username },
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setQuotations(response.data);
        setFilteredQuotations(response.data);
        setLoading(false);
      } catch (error) {
        if(error.response && error.response.status === 401) {
          navigate('/');
        }
        setError('Failed to fetch quotations');
        setLoading(false);
      }
    };

    fetchQuotationsByUsername();
  }, [username]);

  // Handle search functionality
  const handleSearchChange = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);

    const filtered = quotations.filter((quotation) =>
      quotation.quotationNumber.toLowerCase().includes(search) ||
      quotation.user.toLowerCase().includes(search) ||
      quotation.clientName.toLowerCase().includes(search) ||
      quotation.clientCode.toLowerCase().includes(search)
    );

    setFilteredQuotations(filtered);
    setCurrentPage(0); // Reset to first page when search changes
  };

  // Handle pagination change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Calculate the displayed items based on current page
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredQuotations.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredQuotations.length / itemsPerPage);

  const handleViewClick = (id) => {
    navigate(`/Dashboard/viewQuotation/${id}`);
  };

  return (
    <div className="usqu-quotations-container">
          <h1 className="usqu-quotations-title">Quotations</h1>
      <div className="usqu-navbar">
        <input 
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="usqu-searchbar"
        />
        <button className="usqu-add-button" onClick={() => navigate('/homepage')}>
          Add Quotation
        </button>
      </div>
    
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="usqu-error-message">Quotations not found...</p>
      ) : (
        <>
          <div className="usqu-table-wrapper">
            <table className="usqu-quotations-table">
              <thead>
                <tr>
                  <th>Quotation No</th>
                  <th>User</th>
                  <th>Client Name</th>
                  <th>Client Code</th>
                  <th>Total Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((quotation) => (
                  <tr key={quotation._id}>
                    <td>{quotation.quotationNumber}</td>
                    <td>{quotation.user}</td>
                    <td>{quotation.clientName}</td>
                    <td>{quotation.clientCode}</td>
                    <td>{quotation.items.reduce((total, item) => total + item.totalAmount, 0)}</td>
                    <td>
                      <button className="usqu-view-button" onClick={() => handleViewClick(quotation._id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {/* Conditionally render pagination if more than 8 items */}
          {filteredQuotations.length >= 7 && (
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"usqu-pagination"}
              pageClassName={"usqu-pagination-page"}
              previousClassName={"usqu-pagination-previous"}
              nextClassName={"usqu-pagination-next"}
              activeClassName={"usqu-pagination-active"}
              disabledClassName={"usqu-pagination-disabled"}
            />
          )}
          </div>
         
        </>
      )}
    </div>
  );
};

export default Userquotations;
