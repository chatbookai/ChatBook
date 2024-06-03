import React, { ReactNode } from 'react';

import BlankLayout from 'src/@core/layouts/BlankLayout'

const PrivacyPolicy = () => {
  return (
    <div style={{margin: '20px'}}>
      <div className="d-export-content">
        <h2 id="introduction"><span>Introduction</span></h2>
        <p>
          <span>We, </span><strong>ChatbookAi</strong><span> ("</span><strong>Chatbook</strong><span>", "</span><strong>we</strong><span>" or "</span><strong>us</strong><span>")</span>
          <span> respect your privacy and are strongly committed to keeping secure any information we obtain from you or about you. This privacy policy ("Privacy Policy") applies to the personal information that Chatbook processes in connection with Chatbook websites, software and related services (the “Services”), that link to or reference this Privacy Policy. If you have any questions about how we use your personal information, please contact </span>
          chatbookai@gmail.com
        </p>
        

        <h2 id="what-information-we-collect"><span>What Information We Collect</span></h2>
        <p>
          <span>We collect your information in two ways: Information You Provide, and Automatically Collected Information. More detail are provided below.</span>
        </p>

        <h3 id="information-you-provide"><span>Information You Provide</span></h3>
        <p>
          <span>When you create an account, input content, contact us directly, or otherwise use the Services, you may provide some or all of the following information:</span>
        </p>
        <ul>
          <li><strong>Your profile information.</strong><span> You give us information when you register with us, including your email address or Google account. </span></li>
          <li><strong>Your input.</strong><span> When you use our Services, we may collect your text input, prompt or feedback that you provide to our model and Services.</span></li>
          <li><strong>Your payment information.</strong><span> When you use paid services for prepayment, we collect your payment order and transaction information to provide services such as order placement, payment, customer service, and after-sales support.</span></li>
          <li><strong>Your communication information.</strong><span> When you communicate with us, we collect your name, identity information, contact information, and the contents of any messages you send.</span></li>
        </ul>

        <h3 id="automatically-collected-information"><strong>Automatically Collected Information</strong></h3>
        <p><strong>We automatically collect certain information from you when you use the Services, including internet or other network activity information such as your IP address, unique device identifiers, and cookies.</strong></p>
        <ul>
          <li><strong>Log Data.</strong><span> Information that your browser or device automatically sends when you use our Services. Log data includes your Internet Protocol address, browser type and settings, the date and time of your request, and how you interact with our Services.</span></li>
          <li><strong>Usage Information.</strong><span> We collect information regarding your use of the Services, such as the features you use and the actions you take.</span></li>
          <li><strong>Device Information.</strong><span> We collect certain information about the device you use to access the Services, such as your unique device identifiers (device ID), network type and connections, mobile or device model, device manufacturer, application version number, operating system, device resolution, and system language and region.</span></li>
          <li><strong>Cookies.</strong><span> We and our service providers and business partners may use cookies and other similar technologies (e.g., web beacons, flash cookies, etc.) (“Cookies”) to automatically collect information, measure and analyze how you use our Services, enhance your experience using our Services, and improve our Services. Cookies enable our Services to provide certain features and functionality. Web beacons are very small images or small pieces of data embedded in images, also known as “pixel tags” or “clear GIFs,” that can recognize Cookies, the time and date a page is viewed, a description of the page where the pixel tag is placed, and similar information from your computer or device. To learn how to disable certain Cookies, see the “Your Choices” section below.</span></li>
        </ul>

        <h3 id="personal-information-from-other-sources"><span>Information from Other Sources</span></h3>
        <p><span>We may receive the information described in this Privacy Policy from other sources, such as:</span></p>
        <ul>
          <li><span>When you sign-up or log-in to your account using other services such as Google, we collect information from the service, such as access token.</span></li>
        </ul>
        

        <h2 id="how-we-use-your-information"><strong>How We Use Your Information</strong></h2>
        <p><strong>We use your information to promote the safety and security of our Services, including by scanning, analyzing, and reviewing content, messages and associated metadata for violations of our Terms of Service or other conditions and policies. We also use it to operate, provide, develop, and improve the Services, including for the following purposes.</strong></p>
        <ul>
          <li><span>Provide, improve, promote and develop our Services;</span></li>
          <li><span>Provide you with user support, notify you about changes to the services and communicate with you;</span></li>
          <li><span>Detect abuse, fraud and illegal activity on the Services;</span></li>
          <li><span>Promote the safety and security of the Services;</span></li>
          <li><span>Enforce our Terms, Guidelines, and other policies that apply to you and to protect the safety and well-being of our community;</span></li>
          <li><span>Carry out data analysis, research and investigations, and test the Services to ensure its stability and security;</span></li>
          <li><span>Comply with any applicable laws, regulations, codes of practice, guidelines, or rules, or to assist in law enforcement and investigations conducted by any governmental and/or regulatory authority;</span></li>
          <li><span>Understand how you use the Services;</span></li>
          <li><span>Administer the Services, including troubleshooting;</span></li>
          <li><span>Promote the Service or third party services through marketing communications, contests, or promotions;</span></li>
          <li><span>For any other purposes for which you have provided the information, with your consent or at your direction.</span></li>
        </ul>
        

        <h2 id="how-we-share-your-information"><span>How We Share Your Information</span></h2>

        <h3 id="our-corporate-group"><strong>Our Corporate Group</strong></h3>
        <p><span>The Services are supported by certain entities within our corporate group. These entities process Information You Provide, and Automatically Collected Information for us, as necessary to provide certain functions, such as storage, content delivery, security, research and development, analytics, customer and technical support, and content moderation.</span></p>

        <h3 id="in-connection-with-a-sale-merger-or-other-business-transfer"><strong>In Connection with a Sale, Merger, or Other Business Transfer</strong></h3>
        <p><span>We may share the categories of personal information in connection with a substantial corporate transaction, such as the sale of a website, a merger, consolidation, asset sales, or in the unlikely event of bankruptcy.</span></p>

        <h3 id="for-legal-reasons"><strong>For Legal Reasons</strong></h3>
        <p><span>We may access, preserve, and share the information described in "What Information We Collect" with law enforcement agencies, public authorities, copyright holders, or other third parties if we have good faith belief that it is necessary to:</span></p>
        <ul>
          <li><span>comply with applicable law, legal process or government requests, as consistent with internationally recognised standards,</span></li>
          <li><span>protect the rights, property, and safety of our users, copyright holders, and others, including to protect life or prevent imminent bodily harm. For example, we may provide information (such as your IP address) to law enforcement in the event of an emergency where someone's life or safety is at risk,</span></li>
          <li><span>investigate potential violations of and enforce our Terms, Guidelines, or any other applicable terms, policies, or standards, or</span></li>
          <li><span>detect, investigate, prevent, or address misleading activity, copyright infringement, or other illegal activity.</span></li>
        </ul>

        <h3 id="with-your-consent"><strong>With Your Consent</strong></h3>
        <p><span>Depending on where you live, we may share personal information with the proper authorization or to provide the Services you have requested or authorized. For example, if you choose to log in to our Services using a social network account, or share information from our Services to a social media service, we will share that information with those Platforms.</span></p>
        
        <p><strong>Third-party content</strong>. <span>The Services may contain links to policies, functionality, or content maintained by third parties not controlled by us. We are not responsible for, and make no representations regarding, such policies, functionality, or content or any other practices or operations of such third parties.</span></p>
        

        <h2 id="your-rights"><span>Your Rights</span></h2>
        <p><span>Depending on where you live, you may have certain rights with respect to your personal information, such as a right to know how we collect and use your personal information. You may also have a right to access, change, oppose, request a copy of your authorization, file complaints before the competent authorities, withdraw your consent, or limit our collection and use of your personal information as well as to request that we delete it, and potentially others. In certain circumstances, you can also ask us to provide additional information about our collection and use of your personal information. Please note that your exercise of certain rights may impact your ability to use some or all of </span><strong>Chatbook Services'</strong><span> features and functionalities.</span></p>
        <p><span>If you have registered for an account, you may also access, review, and update certain personal information that you have provided to us by logging into your account and using available features and functionalities. </span></p>
        <p><span>Please contact us by using the contact information provided in this Privacy Policy if you would like to exercise any of your rights. We will respond to your request consistent with applicable law and subject to proper verification.</span></p>
        

        <h2 id="your-choices"><span>Your Choices</span></h2>
        <p><span>You can control and access some of your personal information directly through settings. For example, you can manage your API keys. Should you choose to do so, you may also delete your entire account via your settings.</span></p>
        <p><span>You may also be able to control some of the information we collect about you through your device browser settings to refuse or disable Cookies. Because each browser is different, please consult the instructions provided by your browser. Please note that you may need to take additional steps to refuse or disable certain types of Cookies. In addition, your choice to disable Cookies is specific to the particular browser or device that you are using when you disable Cookies, so you may need to separately disable Cookies for each type of browser or device. If you choose to refuse, disable, or delete Cookies, some of the functionality of the Services may no longer be available to you. Without this information, we are not able to provide you with all of the requested services.</span></p>
        

        <h2 id="data-security"><span>Data Security</span></h2>
        <p><span>Security of your information is important to us. We maintain commercially reasonable technical, administrative, and physical security measures that are designed to protect your information from unauthorized access, theft, disclosure, modification, or loss. We regularly review our security measures to consider available new technology and methods. However, no Internet or email transmission is ever fully secure or error free. In particular, email sent to or from us may not be secure. Therefore, you should take special care in deciding what information you send to us via the Service or email. In addition, we are not responsible for circumvention of any privacy settings or security measures contained on the Service, or third-party websites.</span></p>
        

        <h2 id="data-retention"><span>Data Retention</span></h2>
        <p><span>We retain information for as long as necessary to provide our Services and for the other purposes set out in this Privacy Policy. We also retain information when necessary to comply with contractual and legal obligations, when we have a legitimate business interest to do so (such as improving and developing our Services, and enhancing their safety, security and stability), and for the exercise or defense of legal claims.</span></p>
        <p><span>The retention periods will be different depending on the type of information, the purposes for which we use the informationand any legal requirements. For example, when we process your information to provide you with the Services, we keep this information for as long as you have an account. This information includes your profile Information, input and payment information. If you violate any of our terms, policies or guidlines, we may remove your profile Information, input and/or payment information from public view immediately but keep your information as necessary to process the violation.</span></p>
        

        <h2 id="international-data-transfers"><span>International Data Transfers</span></h2>
        <p><span>The personal information we collect from you may be stored on a server located outside of the country where you live. We store the information we collect in secure servers located in the People's Republic of China .</span></p>
        <p><span>Where we transfer any personal information out of the country where you live, including for one or more of the purposes as set out in this Policy, we will do so in accordance with the requirements of applicable data protection laws.</span></p>
        

        <h2 id="information-relating-to-children-under-18"><span>Information relating to children <span className="highlight">under 18</span></span></h2>
        <p><span>Our Services are not aimed at children under the age of 18. If you are 14 or older, but under 18, you should read and agree to this privacy policy together with your parents or other guardians before using our Services.</span></p>
        <p><span>We do not actively collect personal information from children under the age of 14. If we notice or receive feedback that we have collected any of their personal information without prior consent from a guardian, we will attempt to delete the information as soon as possible. If you believe that we processed personal information about or collected from a child under the age of 14, please contact us at </span>
          chatbookai@gmail.com
          <span>.</span>
        </p>
        

        <h2 id="privacy-policy-updates"><span>Privacy Policy Updates</span></h2>
        <p><span>We may update this Privacy Policy from time to time as required by law. When we update the Privacy Policy, we will notify you by updating the “Last Updated” date at the top of the new Privacy Policy, posting the new Privacy Policy, or by providing any other notice required by applicable law. We recommend that you review the Privacy Policy each time you access our Services to stay informed of our privacy practices.</span></p>
        

        <h2 id="contact-us"><span>Contact Us</span></h2>
        <p><span>Questions, comments and requests regarding this policy should be addressed to </span>
          chatbookai@gmail.com
        </p>
      </div>
    </div>
  );
};

PrivacyPolicy.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default PrivacyPolicy;
