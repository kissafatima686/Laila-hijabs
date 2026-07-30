import React from 'react';
import '../components/Footer/FooterPage.css';

const SizeGuide = () => {
  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        <h1>Size Guide</h1>
        <p className="intro">At LAILA HIJABS, we understand the importance of finding the perfect fit when it comes to clothing. That's why we offer a wide range of sizes and lengths to suit your desired fit. Our sizing chart below will help you find the right size for you.</p>

        <h2>WOMEN'S CLOTHING</h2>
        
        <h3>SIZE CONVERSION</h3>
        <div className="table-responsive">
          <table>
          <thead>
            <tr><th>LAILA HIJABS SIZE</th><th>XXS</th><th>XS</th><th>S</th><th>M</th><th>L</th><th>XL</th><th>XXL</th></tr>
          </thead>
          <tbody>
            <tr><td>UK SIZE</td><td>4-6</td><td>6-8</td><td>10-12</td><td>14-16</td><td>18-20</td><td>22-24</td><td>24-26</td></tr>
            <tr><td>US SIZE</td><td>0-2</td><td>2-4</td><td>6-8</td><td>10-12</td><td>14-16</td><td>18-20</td><td>20-22</td></tr>
            <tr><td>EU SIZE</td><td>32-34</td><td>34-36</td><td>38-40</td><td>42-44</td><td>46-48</td><td>50-52</td><td>52-54</td></tr>
          </tbody>
        </table>
      </div>

      <h3>LENGTH MEASUREMENTS</h3>
      <p>These measurements are provided as estimates for customers wearing the garment from the top of the shoulder to just below the ankle. If you plan to wear heels, we recommend sizing up in length.</p>
      <div className="table-responsive">
        <table>
          <thead>
            <tr><th>LENGTH (INCHES)</th><th>52</th><th>54</th><th>56</th><th>58</th><th>62</th></tr>
          </thead>
          <tbody>
            <tr><td>RECOMMENDED HEIGHT</td><td>4'11"-5'2"</td><td>5'2"-5'4"</td><td>5'4"-5'6"</td><td>5'6"-5'8"</td><td>5'9"-6'2"</td></tr>
            <tr><td>RECOMMENDED HEIGHT (CM)</td><td>150-157</td><td>157-163</td><td>163-168</td><td>168-173</td><td>175-188</td></tr>
          </tbody>
        </table>
      </div>
      <div className="how-to-measure-section">
  <h2>HOW TO MEASURE</h2>
  <div className="measure-content">
    <div className="measure-text-left">
      <p>To determine your length, measure from the highest point of your shoulder to the length you want the dress to sit.</p>
      <p><strong>TIP:</strong> For accurate measurements, wear the shoes you intend to pair with the garment. If you plan to wear heels with a garment, consider sizing up for the length measurement.</p>
    </div>
    
    <div className="measure-image">
      <img src="/hero2.png" alt="How to measure guide" />
    </div>

    <div className="measure-text-right">
      <p>Measure around the fullest part of your chest.</p>
      <p>Measure at the narrowest part of your waistline.</p>
      <p>Measure at the fullest part of your hips.</p>
    </div>
  </div>
</div>
      
    </div>
    </div>
  );
};

export default SizeGuide;