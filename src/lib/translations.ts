export type Language = 'en' | 'te' | 'ten'

export const uiTranslations: Record<string, Record<Language, string>> = {
  // Navigation Links
  'nav.home': {
    en: 'Home',
    te: 'హోమ్',
    ten: 'Home'
  },
  'nav.about': {
    en: 'About MP',
    te: 'మన నాయకత్వం',
    ten: 'About Leader'
  },
  'nav.stateFocus': {
    en: 'State Focus',
    te: 'రాష్ట్ర ప్రాధాన్యతలు',
    ten: 'State Focus'
  },
  'nav.publicInitiatives': {
    en: 'Public Initiatives',
    te: 'అభివృద్ధి పనులు',
    ten: 'Public Initiatives'
  },
  'nav.contact': {
    en: 'Contact Office',
    te: 'కార్యాలయం',
    ten: 'Contact Office'
  },
  'nav.grievancePortal': {
    en: 'Grievance Portal',
    te: 'ఫిర్యాదుల పోర్టల్',
    ten: 'Grievance Portal'
  },

  // Titles & Headings
  'site.title': {
    en: 'Bhashyam Ramakrishna | Official Rajya Sabha Portal',
    te: 'భాష్యం రామకృష్ణ | అధికారిక రాజ్యసభ పోర్టల్',
    ten: 'Bhashyam Ramakrishna | Official Rajya Sabha Portal'
  },
  'hero.candidateNomination': {
    en: 'Rajya Sabha Nominee',
    te: 'రాజ్యసభ అభ్యర్థి',
    ten: 'Rajya Sabha Candidate'
  },
  'hero.tagline': {
    en: 'A Visionary Educationist | A Committed Public Leader | A Voice for AP',
    te: 'దూరదృష్టి గల విద్యావేత్త | ప్రజా సేవకుడు | ఆంధ్రప్రదేశ్ బలమైన గొంతుక',
    ten: 'A Visionary Educationist | Public Leader | AP Voice'
  },
  'home.profileIntro': {
    en: 'Profile Intro',
    te: 'పరిచయం',
    ten: 'Profile Intro'
  },
  'home.introCommitment': {
    en: 'Committed to education, youth empowerment, social progress, and the development of Andhra Pradesh.',
    te: 'ఆంధ్రప్రదేశ్ అభివృద్ధికి, యువత సాధికారతకు, నాణ్యమైన విద్యకు మరియు సామాజిక పురోగతికి కట్టుబడి ఉన్నాము.',
    ten: 'AP Development ki, youth empowerment ki, quality education ki, social progress ki కట్టుబడి ఉన్నాము.'
  },

  // Statistics
  'stats.attendance': {
    en: 'Attendance',
    te: 'హాజరు శాతం',
    ten: 'Attendance'
  },
  'stats.debates': {
    en: 'Debates Joined',
    te: 'చర్చలు',
    ten: 'Debates Joined'
  },
  'stats.questions': {
    en: 'Questions Raised',
    te: 'ప్రశ్నలు',
    ten: 'Questions Raised'
  },

  // News & Updates section
  'section.updates': {
    en: 'Parliamentary Updates',
    te: 'పార్లమెంటరీ అప్‌డేట్స్',
    ten: 'Parliamentary Updates'
  },
  'section.news': {
    en: 'Press Releases',
    te: 'పత్రికా ప్రకటనలు',
    ten: 'Press Releases'
  },
  'section.gallery': {
    en: 'Activity Gallery',
    te: 'ఫోటో గ్యాలరీ',
    ten: 'Activity Gallery'
  },
  'section.initiatives': {
    en: 'Active Initiatives & Pushes',
    te: 'ప్రస్తుత అభివృద్ధి కార్యక్రమాలు',
    ten: 'Active Initiatives & Pushes'
  },

  // Grievance Portal labels
  'grievance.title': {
    en: 'Public Grievance Portal',
    te: 'ప్రజా ఫిర్యాదుల పోర్టల్',
    ten: 'Public Grievance Portal'
  },
  'grievance.subtitle': {
    en: 'Submit local challenges, community requests, or suggestions directly to our office. Track ticket updates and resolutions live.',
    te: 'మీ స్థానిక సమస్యలు, సలహాలను నేరుగా మా కార్యాలయానికి పంపండి. ఫిర్యాదుల పరిష్కారాన్ని మరియు అప్‌డేట్స్‌ను లైవ్‌లో ట్రాక్ చేయండి.',
    ten: 'మీ local issues ని, suggestions ని direct గా Office కి పంపండి. Resolve అయ్యేంత వరకు live గా track చేసుకోండి.'
  },
  'grievance.submitTab': {
    en: 'Submit Grievance',
    te: 'ఫిర్యాదు సమర్పించండి',
    ten: 'Submit Grievance'
  },
  'grievance.trackTab': {
    en: 'Track Ticket Status',
    te: 'టికెట్ ట్రాక్ చేయండి',
    ten: 'Ticket Status Track చెయ్యండి'
  },
  'grievance.citizenName': {
    en: 'Citizen Full Name *',
    te: 'పౌరుడి పూర్తి పేరు *',
    ten: 'Citizen Full Name *'
  },
  'grievance.contactPhone': {
    en: 'Contact Phone Number *',
    te: 'ఫోన్ నంబర్ *',
    ten: 'Phone Number *'
  },
  'grievance.selectCategory': {
    en: 'Grievance Category *',
    te: 'సమస్య విభాగం *',
    ten: 'Grievance Category *'
  },
  'grievance.description': {
    en: 'Detailed Description of Issue *',
    te: 'సమస్య పూర్తి వివరాలు *',
    ten: 'Issue complete details *'
  },
  'grievance.uploadMock': {
    en: 'Attachment / Media Uploader (PDF, Images)',
    te: 'పత్రాలు / మీడియా అప్‌లోడర్ (PDF, ఫోటోలు)',
    ten: 'Attachment / Media Uploader (PDF, Images)'
  },
  'grievance.locationHeader': {
    en: 'Geographic Location Details',
    te: 'భౌగోళిక వివరాలు',
    ten: 'Location Details'
  },
  'grievance.state': {
    en: 'State',
    te: 'రాష్ట్రం',
    ten: 'State'
  },
  'grievance.district': {
    en: 'District',
    te: 'జిల్లా',
    ten: 'District'
  },
  'grievance.cityTown': {
    en: 'City / Town',
    te: 'నగరం / పట్టణం',
    ten: 'City / Town'
  },
  'grievance.mandal': {
    en: 'Mandal',
    te: 'మండలం',
    ten: 'Mandal'
  },
  'grievance.villageWard': {
    en: 'Village / Ward',
    te: 'గ్రామం / వార్డు',
    ten: 'Village / Ward'
  },
  'grievance.address': {
    en: 'Postal Address',
    te: 'చిరునామా',
    ten: 'Address'
  },
  'grievance.pincode': {
    en: 'Pincode',
    te: 'పిన్‌కోడ్',
    ten: 'Pincode'
  },
  'grievance.successMsg': {
    en: 'Grievance submitted successfully!',
    te: 'ఫిర్యాదు విజయవంతంగా సమర్పించబడింది!',
    ten: 'Grievance successful గా submit అయింది!'
  },
  'grievance.searchTicket': {
    en: 'Search Ticket ID',
    te: 'టికెట్ ఐడీ నమోదు చేయండి',
    ten: 'Ticket ID search చెయ్యండి'
  },

  // Contact Page
  'contact.header': {
    en: 'Contact the Office of Rajya Sabha MP',
    te: 'రాజ్యసభ సభ్యుని కార్యాలయం వివరాలు',
    ten: 'Contact Rajya Sabha MP Office'
  },
  'contact.sub': {
    en: 'Reach out to our offices in New Delhi or our State headquarters. Submit inquiries, suggestions, or policy feedback directly.',
    te: 'న్యూఢిల్లీ లేదా మన విజయవాడ క్యాంప్ ఆఫీస్ అధికారులను నేరుగా సంప్రదించండి. సలహాలు, సూచనలను ఇక్కడ పంపవచ్చు.',
    ten: 'Delhi or state headquarters office ని contact అవ్వండి. Inquiries, policy suggestions direct గా పంపండి.'
  },
  'contact.addresses': {
    en: 'Office Addresses',
    te: 'కార్యాలయాల చిరునామా',
    ten: 'Office Addresses'
  },
  'contact.delhiTitle': {
    en: 'New Delhi Office',
    te: 'న్యూఢిల్లీ కార్యాలయం',
    ten: 'New Delhi Office'
  },
  'contact.stateTitle': {
    en: 'State Camp Office',
    te: 'రాష్ట్ర క్యాంప్ కార్యాలయం',
    ten: 'State Camp Office'
  },
  'contact.sendMessage': {
    en: 'Send a Message',
    te: 'సందేశం పంపండి',
    ten: 'Message Send చెయ్యండి'
  },

  // General Buttons & Fallbacks
  'button.watchSpeech': {
    en: 'Watch Speech',
    te: 'ప్రసంగం చూడండి',
    ten: 'Speech చూడండి'
  },
  'button.send': {
    en: 'Send Message',
    te: 'సందేశం పంపండి',
    ten: 'Send Message'
  },
  'button.submitting': {
    en: 'Submitting...',
    te: 'సమర్పిస్తున్నాము...',
    ten: 'Submit అవుతోంది...'
  },
  'footer.description': {
    en: 'Dedicated to representing the voices, issues, and growth of our citizens in the Parliament of India.',
    te: 'భారత పార్లమెంటులో పౌరుల గొంతుకను బలంగా వినిపించడానికి, వారి ప్రగతికి నిరంతరం కృషి చేస్తాము.',
    ten: 'Indian Parliament లో public voices ని, issues ని represent చేయడానికి కట్టుబడి ఉన్నాము.'
  },
  'footer.official': {
    en: 'This is the official public portal for citizen grievance redressal, policy initiatives, and updates.',
    te: 'ఇది పౌరుల సమస్యల పరిష్కారం, అభివృద్ధి పనులు మరియు తాజా సమాచారం అందించే అధికారిక వెబ్‌సైట్.',
    ten: 'ఇది citizen grievance redressal, policy initiatives, and updates కి సంబంధించిన official portal.'
  },
  // Extra Grievance Portal keys
  'grievance.portalTitle': {
    en: 'Public Grievance Portal',
    te: 'ప్రజా ఫిర్యాదుల పోర్టల్',
    ten: 'Public Grievance Portal'
  },
  'grievance.portalSubtitle': {
    en: 'Submit policy issues, civic difficulties, or local grievances directly to the office of Hon. MP Bhashyam Ramakrishna. Track ticket status transparently.',
    te: 'స్థానిక సమస్యలు, పౌర ఇబ్బందులు లేదా ప్రజా ఫిర్యాదులను గౌరవనీయులైన రాజ్యసభ సభ్యులు భాష్యం రామకృష్ణ గారి కార్యాలయానికి నేరుగా పంపండి. టికెట్ స్థితిని పారదర్శకంగా ట్రాక్ చేయండి.',
    ten: 'Local issues ని, local challenges ని Hon. MP Bhashyam Ramakrishna గారి office కి direct గా submit చెయ్యండి. Clear గా status track చేసుకోండి.'
  },
  'grievance.successTitle': {
    en: 'Grievance Logged Securely!',
    te: 'ఫిర్యాదు విజయవంతంగా నమోదు చేయబడింది!',
    ten: 'Grievance ticket successful గా register అయింది!'
  },
  'grievance.successDesc': {
    en: 'We have successfully registered your ticket. Please note down your unique tracking ID below to check live status updates.',
    te: 'మీ టికెట్ విజయవంతంగా నమోదైంది. దయచేసి లైవ్ అప్‌డేట్స్ తెలుసుకోవడం కోసం మీ విలక్షణమైన ట్రాకింగ్ ఐడీని నోట్ చేసుకోండి.',
    ten: 'We registered your ticket successfully. Live status checks కోసం కింద ఉన్న tracking ID ని note చేసుకోండి.'
  },
  'grievance.trackingIdLabel': {
    en: 'Your Tracking ID',
    te: 'మీ ట్రాకింగ్ ఐడీ',
    ten: 'Your Tracking ID'
  },
  'grievance.copied': {
    en: 'Copied!',
    te: 'కాపీ చేయబడింది!',
    ten: 'Copied!'
  },
  'grievance.trackThisButton': {
    en: 'Track this Ticket',
    te: 'ఈ టికెట్‌ను ట్రాక్ చేయండి',
    ten: 'Track this Ticket'
  },
  'grievance.submitAnotherButton': {
    en: 'Submit Another Grievance',
    te: 'మరొక ఫిర్యాదు సమర్పించండి',
    ten: 'Submit Another Grievance'
  },
  'grievance.formHeader': {
    en: 'Public Grievance / Citizen Issue Submission Form',
    te: 'ప్రజా ఫిర్యాదులు / పౌరుల సమస్యల సమర్పణ ఫారమ్',
    ten: 'Public Grievance / Citizen Issue Submission Form'
  },
  'grievance.citizenNamePlaceholder': {
    en: 'Full Name',
    te: 'పూర్తి పేరు',
    ten: 'Full Name'
  },
  'grievance.emailLabel': {
    en: 'Email Address *',
    te: 'ఈమెయిల్ చిరునామా *',
    ten: 'Email Address *'
  },
  'grievance.emailPlaceholder': {
    en: 'email@example.com',
    te: 'email@example.com',
    ten: 'email@example.com'
  },
  'grievance.phonePlaceholder': {
    en: '+91 98765 43210',
    te: '+91 98765 43210',
    ten: '+91 98765 43210'
  },
  'grievance.categorySelect': {
    en: 'Select Category',
    te: 'విభాగం ఎంచుకోండి',
    ten: 'Select Category'
  },
  'grievance.statePlaceholder': {
    en: 'e.g. Andhra Pradesh',
    te: 'ఉదా. ఆంధ్రప్రదేశ్',
    ten: 'e.g. Andhra Pradesh'
  },
  'grievance.districtPlaceholder': {
    en: 'District Name',
    te: 'జిల్లా పేరు',
    ten: 'District Name'
  },
  'grievance.cityTownPlaceholder': {
    en: 'City/Town Name',
    te: 'నగరం/పట్టణం పేరు',
    ten: 'City/Town Name'
  },
  'grievance.mandalPlaceholder': {
    en: 'Mandal Name',
    te: 'మండలం పేరు',
    ten: 'Mandal Name'
  },
  'grievance.villageWardPlaceholder': {
    en: 'Village / Ward No.',
    te: 'గ్రామం / వార్డు నంబర్',
    ten: 'Village / Ward No.'
  },
  'grievance.addressPlaceholder': {
    en: 'House No., Street name, Landmark',
    te: 'ఇంటి నంబరు, వీధి పేరు, గుర్తులు',
    ten: 'House No., Street name, Landmark'
  },
  'grievance.pincodePlaceholder': {
    en: '6-digit PIN',
    te: '6 అంకెల పిన్‌కోడ్',
    ten: '6-digit PIN'
  },
  'grievance.subjectLabel': {
    en: 'Issue Title / Subject *',
    te: 'సమస్య శీర్షిక / అంశం *',
    ten: 'Issue Title / Subject *'
  },
  'grievance.subjectPlaceholder': {
    en: 'Brief title of the grievance',
    te: 'సమస్య యొక్క సంక్షిప్త వివరణ',
    ten: 'Brief title of the grievance'
  },
  'grievance.descriptionPlaceholder': {
    en: 'Provide details about the issue, how long it has been ongoing, and any previous administrative attempts...',
    te: 'సమస్యకు సంబంధించిన వివరాలు, ఇది ఎంతకాలంగా ఉంది మరియు ఇంతకు ముందు చేసిన ప్రయత్నాలను ఇక్కడ తెలపండి...',
    ten: 'Provide details about the issue, how long it is happening, and before updates/attempts details...'
  },
  'grievance.uploadDocLabel': {
    en: 'Upload Supporting Document / Image (Optional)',
    te: 'ఆధార పత్రాలు / ఫోటో అప్‌లోడ్ చేయండి (ఐచ్ఛికం)',
    ten: 'Upload Supporting Document / Image (Optional)'
  },
  'grievance.dragDropText': {
    en: 'Drag & Drop or Click to Upload',
    te: 'లాగి ఇక్కడ వేయండి లేదా అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి',
    ten: 'Drag & Drop or Click to Upload'
  },
  'grievance.dragDropSub': {
    en: 'PDF, PNG, JPG, or DOC (Max 5MB)',
    te: 'PDF, PNG, JPG, లేదా DOC (గరిష్టంగా 5MB)',
    ten: 'PDF, PNG, JPG, or DOC (Max 5MB)'
  },
  'grievance.privacyNotice': {
    en: 'Public Service Privacy Notice: All personal contact details are stored strictly server-side in our private PostgreSQL database. They will never be exposed on public trackers.',
    te: 'ప్రజా సేవా గోప్యతా నోటీసు: పౌరుల వ్యక్తిగత వివరాలన్నీ మా ప్రైవేట్ పోస్ట్‌గ్రేస్ డేటాబేస్‌లో సురక్షితంగా నిల్వ చేయబడతాయి. అవి ఎప్పుడూ బహిర్గతం చేయబడవు.',
    ten: 'Public Service Privacy Notice: All contact details are stored strictly server-side database. Public tracker లో display అవ్వవు.'
  },
  'grievance.submittingText': {
    en: 'Filing Grievance securely...',
    te: 'ఫిర్యాదును భద్రంగా నమోదు చేస్తున్నాము...',
    ten: 'Filing Grievance securely...'
  },
  'grievance.trackHeader': {
    en: 'Track Existing Grievance',
    te: 'ఇప్పటికే ఉన్న ఫిర్యాదును ట్రాక్ చేయండి',
    ten: 'Track Existing Grievance'
  },
  'grievance.trackSub': {
    en: 'Enter your unique tracking ID (e.g. GRV-YYYYMMDD-XXXX) below to fetch your ticket status.',
    te: 'మీ టికెట్ స్థితిని తెలుసుకోవడం కోసం మీ ట్రాకింగ్ ఐడీని (ఉదా. GRV-YYYYMMDD-XXXX) నమోదు చేయండి.',
    ten: 'Enter your unique tracking ID (e.g. GRV-YYYYMMDD-XXXX) below to check status.'
  },
  'grievance.trackPlaceholder': {
    en: 'GRV-20260607-1234',
    te: 'GRV-20260607-1234',
    ten: 'GRV-20260607-1234'
  },
  'grievance.searchingText': {
    en: 'Searching...',
    te: 'శోధిస్తున్నాము...',
    ten: 'Searching...'
  },
  'grievance.fetchingText': {
    en: 'Fetching ticket status from server...',
    te: 'సర్వర్ నుండి టికెట్ స్థితిని సేకరిస్తున్నాము...',
    ten: 'Fetching ticket status from server...'
  },
  'grievance.notFoundTitle': {
    en: 'Ticket Not Found',
    te: 'టికెట్ కనుగొనబడలేదు',
    ten: 'Ticket Not Found'
  },
  'grievance.notFoundDesc': {
    en: 'We could not find any grievance ticket with the ID',
    te: 'మేము ఈ ఐడీతో ఏ ఫిర్యాదు టికెట్‌ను కనుగొనలేకపోయాము',
    ten: 'We could not find any grievance ticket with the ID'
  },
  'grievance.notFoundVerify': {
    en: 'Please verify the ID and try again.',
    te: 'దయచేసి ఐడీని తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    ten: 'Please verify the ID and try again.'
  },
  'grievance.ticketRef': {
    en: 'Ticket Reference',
    te: 'టికెట్ రిఫరెన్స్',
    ten: 'Ticket Reference'
  },
  'grievance.statusPending': {
    en: 'SUBMITTED',
    te: 'సమర్పించబడింది',
    ten: 'SUBMITTED'
  },
  'grievance.statusInProgress': {
    en: 'UNDER REVIEW',
    te: 'పరిశీలనలో ఉంది',
    ten: 'UNDER REVIEW'
  },
  'grievance.statusResolved': {
    en: 'RESOLUTION',
    te: 'పరిష్కరించబడింది',
    ten: 'RESOLUTION'
  },
  'grievance.registeredDate': {
    en: 'Registered Date',
    te: 'నమోదైన తేదీ',
    ten: 'Registered Date'
  },
  'grievance.geoArea': {
    en: 'Citizen Geographic Area / Address',
    te: 'పౌరుడి నివాస ప్రాంతం / చిరునామా',
    ten: 'Citizen Area / Address'
  },
  'grievance.stateLabelField': {
    en: 'State',
    te: 'రాష్ట్రం',
    ten: 'State'
  },
  'grievance.districtLabelField': {
    en: 'District',
    te: 'జిల్లా',
    ten: 'District'
  },
  'grievance.areaLabelField': {
    en: 'Area',
    te: 'ప్రాంతం',
    ten: 'Area'
  },
  'grievance.addressLabelField': {
    en: 'Address',
    te: 'చిరునామా',
    ten: 'Address'
  },
  'grievance.pincodeLabelField': {
    en: 'Pincode',
    te: 'పిన్‌కోడ్',
    ten: 'Pincode'
  },
  'grievance.subjectLabelField': {
    en: 'Subject',
    te: 'అంశం',
    ten: 'Subject'
  },
  'grievance.descriptionLabelField': {
    en: 'Description Submitted',
    te: 'సమర్పించిన వివరణ',
    ten: 'Description Submitted'
  },
  'grievance.officialResponse': {
    en: 'Official Office Response',
    te: 'కార్యాలయ అధికారిక సమాధానం',
    ten: 'Official Office Response'
  },

  // Contact Page extra keys
  'contact.getInTouch': {
    en: 'Get in Touch',
    te: 'సంప్రదించండి',
    ten: 'Get in Touch'
  },
  'contact.delhiSubtitle': {
    en: 'Rajya Sabha Secretariat',
    te: 'రాజ్యసభ సెక్రటేరియట్',
    ten: 'Rajya Sabha Secretariat'
  },
  'contact.stateSubtitle': {
    en: 'Andhra Pradesh Headquarters',
    te: 'ఆంధ్రప్రదేశ్ ప్రధాన కార్యాలయం',
    ten: 'Andhra Pradesh Headquarters'
  },
  'contact.sendMessageDesc': {
    en: 'Fill out the form below, and our staff will review your message and reply as soon as possible.',
    te: 'కింది ఫారమ్‌ను పూరించండి, మా బృందం మీ సందేశాన్ని సమీక్షించి వీలైనంత త్వరగా సమాధానం ఇస్తుంది.',
    ten: 'Fill the form below, target team status review చేసి fast గా respond అవుతారు.'
  },
  'contact.successMsg': {
    en: 'Message sent successfully! Our administrative team will reach out to you shortly.',
    te: 'సందేశం విజయవంతంగా పంపబడింది! మా బృందం త్వరలోనే మిమ్మల్ని సంప్రదిస్తుంది.',
    ten: 'Message successful గా send అయింది! Our administrative team very soon touch లోకి వస్తారు.'
  },
  'contact.yourName': {
    en: 'Your Name *',
    te: 'మీ పేరు *',
    ten: 'Your Name *'
  },
  'contact.namePlaceholder': {
    en: 'Full Name',
    te: 'పూర్తి పేరు',
    ten: 'Full Name'
  },
  'contact.emailAddress': {
    en: 'Email Address *',
    te: 'ఈమెయిల్ చిరునామా *',
    ten: 'Email Address *'
  },
  'contact.emailPlaceholder': {
    en: 'email@example.com',
    te: 'email@example.com',
    ten: 'email@example.com'
  },
  'contact.subject': {
    en: 'Subject',
    te: 'అంశం',
    ten: 'Subject'
  },
  'contact.subjectPlaceholder': {
    en: 'Brief subject of message',
    te: 'సందేశం యొక్క అంశం',
    ten: 'Brief subject of message'
  },
  'contact.messageDetails': {
    en: 'Message Details *',
    te: 'సందేశం వివరాలు *',
    ten: 'Message Details *'
  },
  'contact.messagePlaceholder': {
    en: 'Write details of your message...',
    te: 'మీ సందేశం వివరాలు ఇక్కడ రాయండి...',
    ten: 'Write details of your message here...'
  },
  'contact.sendingText': {
    en: 'Sending message...',
    te: 'సందేశం పంపుతున్నాము...',
    ten: 'Sending message...'
  },

  // Validation Error Keys
  'validation.nameRequired': {
    en: 'Full name is required',
    te: 'పూర్తి పేరు నమోదు చేయడం తప్పనిసరి',
    ten: 'Full name is required'
  },
  'validation.emailInvalid': {
    en: 'Please provide a valid email',
    te: 'దయచేసి సరైన ఈమెయిల్ అందించండి',
    ten: 'Valid email ID ఇవ్వండి'
  },
  'validation.phoneInvalid': {
    en: 'Provide a valid phone number (10-12 digits)',
    te: 'సరైన ఫోన్ నంబర్ (10-12 అంకెలు) అందించండి',
    ten: 'Valid phone number (10-12 digits) ఇవ్వండి'
  },
  'validation.stateRequired': {
    en: 'State is required',
    te: 'రాష్ట్రం పేరు తప్పనిసరి',
    ten: 'State is required'
  },
  'validation.districtRequired': {
    en: 'District is required',
    te: 'జిల్లా పేరు తప్పనిసరి',
    ten: 'District is required'
  },
  'validation.pincodeInvalid': {
    en: 'Provide a valid 6-digit pincode',
    te: 'సరైన 6 అంకెల పిన్‌కోడ్ అందించండి',
    ten: 'Valid 6-digit pincode ఇవ్వండి'
  },
  'validation.categoryRequired': {
    en: 'Please select a category',
    te: 'దయచేసి ఒక విభాగాన్ని ఎంచుకోండి',
    ten: 'Category select చెయ్యండి'
  },
  'validation.subjectRequired': {
    en: 'Subject is required',
    te: 'సమస్య అంశం తప్పనిసరి',
    ten: 'Subject is required'
  },
  'validation.descriptionRequired': {
    en: 'Provide a detailed description (at least 20 characters)',
    te: 'దయచేసి సవివరమైన వివరణ అందించండి (కనీసం 20 అక్షరాలు)',
    ten: 'Detailed description (at least 20 characters) ఇవ్వండి'
  },
  'footer.resources': {
    en: 'Resources & Navigation',
    te: 'వనరులు & నావిగేషన్',
    ten: 'Resources & Navigation'
  },
  'footer.rights': {
    en: 'All Rights Reserved.',
    te: 'సర్వ హక్కులు ప్రత్యేకించబడినవి.',
    ten: 'All Rights Reserved.'
  },
  'footer.office': {
    en: 'Office of',
    te: 'కార్యాలయం,',
    ten: 'Office of'
  }
}

// Localized Categories list for Grievances
export const grievanceCategories: Record<string, Record<Language, string>> = {
  'infra': { en: 'Infrastructure & Roads', te: 'మౌలిక వసతులు & రోడ్లు', ten: 'Infrastructure & Roads' },
  'water': { en: 'Water & Sanitation', te: 'తాగునీరు & పారిశుధ్యం', ten: 'Water & Sanitation' },
  'agri': { en: 'Agriculture & Subsidies', te: 'వ్యవసాయం & రాయితీలు', ten: 'Agriculture & Subsidies' },
  'health': { en: 'Healthcare & Hospitals', te: 'వైద్యం & ఆసుపత్రులు', ten: 'Healthcare & Hospitals' },
  'edu': { en: 'Education & Schools', te: 'విద్య & పాఠశాలలు', ten: 'Education & Schools' },
  'digital': { en: 'Digital Connectivity', te: 'డిజిటల్ కనెక్టివిటీ', ten: 'Digital Connectivity' },
  'power': { en: 'Electricity & Street Lights', te: 'విద్యుత్ & వీధి దీపాలు', ten: 'Electricity & Street Lights' },
  'welfare': { en: 'Welfare Schemes', te: 'సంక్షేమ పథకాలు', ten: 'Welfare Schemes' },
  'employ': { en: 'Employment & Skill Development', te: 'ఉపాధి & నైపుణ్యాభివృద్ధి', ten: 'Employment & Skill Development' },
  'admin': { en: 'Public Administration', te: 'ప్రజా పరిపాలన', ten: 'Public Administration' },
  'other': { en: 'Other Public Issue', te: 'ఇతర ప్రజా సమస్యలు', ten: 'Other Public Issue' }
}
