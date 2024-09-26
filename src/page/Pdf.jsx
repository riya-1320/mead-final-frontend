import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";
import "./pdf.css";
import logo from "../assets/headerlogo.jpg";
import api from "../utilities/api";
import { useNavigate } from "react-router-dom";

export const Quotation = forwardRef((props, ref) => {
  const [quotationData, setQuotationData] = useState({ items: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuotationData = async () => {
      try {
        const response = await api.get(`/combined/${props.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),  // Retrieving the token from localStorage
          },
        });
        
        // axios automatically parses the JSON response
        const data = response.data;
        console.log(JSON.stringify(data));
        setQuotationData(data);
      } catch (err) {
        if(err.response && err.response.status === 401) {
          navigate('/');
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationData();
  }, [props.id]);

  useImperativeHandle(ref, () => ({
    exportPDF: async () => {
      const element = document.querySelector("main");
  
      // Define the options for html2pdf
      const options = {
        margin: [35, 5, 20, 5], // Margins
        filename: "quotation.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 4,
          useCORS: true, // Enable cross-origin for the image
          logging: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };
  
      try {
        // Generate the PDF from the HTML content
        const pdf = await html2pdf().set(options).from(element).toPdf().get('pdf');
  
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
  
        // Load the logo image
        const img = new Image();
        img.src = logo; // Using the imported logo variable directly
  
        const logoWidth = pageWidth * 0.8;
        const logoXPosition = (pageWidth - logoWidth) / 2; // Center the logo

        
        // Loop through all pages to add header and footer
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
  
          // Add the logo to the header (full-width)
          const headerHeight = 20; // Adjust the height of the header as needed
          pdf.addImage(img, 'PNG', logoXPosition, 10, logoWidth, headerHeight);
  
          
          // Add footer text
          const footerText = `Mead Interior Design LLC`;
          const pageText = `Page ${i} of ${totalPages}`;
          pdf.setFontSize(10);
          pdf.text(footerText, 10, pageHeight - 10); // Left aligned footer text
          pdf.text(pageText, pageWidth - 50, pageHeight - 10); // Right aligned page number
        }
  
        // Save the PDF
        pdf.save(options.filename);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    },
  }));
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!quotationData || !Array.isArray(quotationData.items) || quotationData.items.length === 0) {
    return <p>No data available</p>;
  }

  const { quotationNumber,clientName, clientCode, materials, items } = quotationData;

  return (
    <section className="quotationpdf" ref={ref}>
      <div className="logo">{/* <img src={logo} alt="Logo" /> */}</div>
      <main>
        <h2 className="top-header" id="quotation-title">
          QUOTATION FOR CHAIRS OFFICE AT {clientCode}
        </h2>
        <div className="client-details-table">
          <table className="client-details">
            <thead>
              <tr>
                <th colSpan="2">CLIENT DETAILS:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CLIENT NAME :</td>
                <td id="client-name">{clientName}</td>
              </tr>
              <tr>
                <td> CLIENT CODE :</td>
                <td id="company-name">{clientCode}</td>
              </tr>
              <tr>
                <td> QUOTATOIN NO :</td>
                <td id="quotation-number">{quotationNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="subject">
          <div className="subject-description">
            <h3>Subject:</h3>
            <p id="subject-description">
              Quotation for supply and installation of Chairs at {clientCode}.
            </p>
          </div>
          <p className="description-head" id="description-header">
            We thank you for giving us an opportunity to quote for supply and installation of Chairs at {clientCode}. Based on their discussions, please find below our best possible offer for the same.
          </p>
        </div>

        <table className="description-table">
          <thead>
            <tr>
              <th>SL NO</th>
              <th>DESCRIPTION</th>
              {/* <th>IMAGE</th> */}
              <th>QTY</th>
              <th>UNIT</th>
              <th>RATE</th>
              <th>AMOUNT (In AED)</th>
            </tr>
          </thead>
          <tbody id="items-list">
            {Array.isArray(items) && items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td className="item-description">
                  <strong className="pdf-item-name"> Item name: {item.itemSelect}</strong>
                  <br />
                  <div className="component-section">
                    {item.components.map((component, idx) => (
                      <div className="component-item" key={idx}>
                        <div className="component-unit">
                          <strong>Materials used for :</strong> {component.unit}
                        </div>
                        <ul className="material-list">
                          {component.materials.map((material, idx) => (
                            <li key={idx}>{material.material}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <hr/>
                  <div className="bo-section">
                    <strong className="bo-title">B/O:</strong>
                    <div className="component-section">
                      {item.bo.map((bo, idx) => (
                        <div className="bo-item" key={idx}>
                          <div className="bo-details">
                            {bo.materialname} - {bo.quantity}
                          </div>
                          <ul className="material-list">
                            {bo.materials.map((material, idx) => (
                              <li key={idx}>{material.material}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                {/* <td>
                   img
                </td> */}
                <td>
                  1 {/* {item.components.reduce((acc, comp) => acc + comp.quantity, 0)} */}
                </td>
                <td>
                  {/* Nos */}
                </td>
                <td>
                  {/* {item.components[0].materials[0]?.value || 0} */}
                </td>
                <td className="amount">{item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="table-footer">
            <tr>
              <td colSpan="4"></td>
              <td>TOTAL</td>
              <td id="total-amount">{items.reduce((acc, item) => acc + item.totalAmount, 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="4"></td>
              <td>VAT 5%</td>
              <td id="vat-amount">
                {((items.reduce((acc, item) => acc + item.totalAmount, 0) * 5) / 100).toFixed(2)}
              </td>
            </tr>
            <tr className="table-footer-final">
              <td colSpan="5" id="final-amount-words">
                {/* Add logic for amount in words */}
              </td>
              <td id="final-amount">
                {(
                  items.reduce((acc, item) => acc + item.totalAmount, 0) +
                  (items.reduce((acc, item) => acc + item.totalAmount, 0) * 5) / 100
                ).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <h3 className="exclusions">
          EXCLUSIONS: Any scope of works which are not mentioned above.
        </h3>

        <h3 className="terms-conditions-header">TERMS AND CONDITIONS</h3>
        <table className="tandc">
          <tr>
            <td>1. Contract</td>
            <td id="contract-terms">
             <p> The final quantity of items & total value is subject to change as
              per the approved drawings and documents.</p>
            </td>
          </tr>
          <tr>
            <td>2. Payment terms</td>
            <td id="payment-terms">Payments are due 30 days from the date of invoice.</td>
          </tr>
          <tr>
            <td>3. Delivery & Completion</td>
            <td id="delivery-completion">
              Delivery will be made within 4-6 weeks from the date of confirmed order.
            </td>
          </tr>
          <tr>
            <td>Validity</td>
            <td id="validity">
              Quotation is valid for 30 days from the date of issue.
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              We believe the above quotation covers all important aspects
              concerning the products and services to be supplied and we thank
              you for giving us an opportunity to submit this quotation. We will
              be pleased to answer any query you may have with regard to the
              above or any other related matter, subject to which we look
              forward to receiving your valuable order confirmation within the
              validity period stated in the quotation. <br />
              <br />
              Yours faithfully <br />
              <br />
              Max Ebenezer Thomas <br />
              <br />
              MEAD Interior Design LLC <br />
              <br />
              Email: Architect@meadinteriors.com <br />
              <br />
              Mobile: 0555577359 <br />
              <br />
            </td>
          </tr>
        </table>
        <table style={{ width: "100%" }}>
          <tr className="tandc-footer-head">
            <th>Prepared by: Estimator</th>
            <th>Verified by: Design Manager</th>
            <th>Approved by: General Manager</th>
          </tr>
          <tr className="tandc-footer-bottom">
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </main>
    </section>
  );
});
