export type Language = 'en' | 'te'

export const uiTranslations: Record<string, Record<Language, string> & { ten?: string }> = {
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
  'nav.updates': {
    en: 'Updates',
    te: 'తాజా సమాచారం',
    ten: 'Updates'
  },
  'nav.dailyUpdates': {
    en: 'Daily Updates',
    te: 'రోజువారీ అప్‌డేట్స్',
    ten: 'Daily Updates'
  },

  // Titles & Headings
  'site.title': {
    en: 'Bhashyam Rama Krishna | Official Rajya Sabha Portal',
    te: 'భాష్యం రామకృష్ణ | అధికారిక రాజ్యసభ పోర్టల్',
    ten: 'Bhashyam Rama Krishna | Official Rajya Sabha Portal'
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
  'section.dailyUpdates': {
    en: 'Daily Updates',
    te: 'రోజువారీ అప్‌డేట్స్',
    ten: 'Daily Updates'
  },
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
  'grievance.locationSubheader': {
    en: 'Location Details',
    te: 'స్థాన వివరాలు',
    ten: 'Location Details'
  },
  'grievance.selectLocationTitle': {
    en: 'Select Village / Area',
    te: 'గ్రామం / ప్రాంతాన్ని ఎంచుకోండి',
    ten: 'Select Village / Area'
  },
  'grievance.noLocationsFound': {
    en: 'No locations found for this pincode.',
    te: 'ఈ పిన్‌కోడ్‌కు ఎటువంటి ప్రాంతాలు లభించలేదు.',
    ten: 'Pincode కి ఏ areas దొరకలేదు.'
  },
  'grievance.manualEntryTitle': {
    en: 'Enter Details Manually',
    te: 'వివరాలను మాన్యువల్‌గా నమోదు చేయండి',
    ten: 'Details manual గా enter చెయ్యండి'
  },
  'grievance.changeLocation': {
    en: 'Change Location',
    te: 'స్థానాన్ని మార్చండి',
    ten: 'Location ని change చెయ్యండి'
  },
  'grievance.enterManually': {
    en: 'Can\'t find your village? Enter manually',
    te: 'మీ గ్రామం లేదా ప్రాంతం లేదా వార్డు కనపడలేదా? ఇక్కడ నమోదు చేయండి',
    ten: 'Village లేకపోతే manual గా enter చెయ్యండి'
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
    en: 'Watch Video',
    te: 'వీడియో చూడండి',
    ten: 'Video చూడండి'
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
  'grievance.citizenNameLabel': {
    en: 'Citizen Full Name *',
    te: 'పౌరుడి పూర్తి పేరు *',
    ten: 'Citizen Full Name *'
  },
  'grievance.phoneLabel': {
    en: 'Contact Phone Number *',
    te: 'ఫోన్ నంబర్ *',
    ten: 'Phone Number *'
  },
  'grievance.categoryLabel': {
    en: 'Grievance Category *',
    te: 'సమస్య విభాగం *',
    ten: 'Grievance Category *'
  },
  'grievance.descriptionLabel': {
    en: 'Detailed Description of Issue *',
    te: 'సమస్య పూర్తి వివరాలు *',
    ten: 'Issue complete details *'
  },
  'grievance.submitButton': {
    en: 'Submit Grievance Securely',
    te: 'ఫిర్యాదును భద్రంగా సమర్పించండి',
    ten: 'Submit Grievance securely'
  },
  'grievance.trackButton': {
    en: 'Track Grievance',
    te: 'ఫిర్యాదు స్థితిని తనిఖీ చేయండి',
    ten: 'Track Grievance'
  },
  'grievance.categoryLabelField': {
    en: 'Grievance Category',
    te: 'సమస్య విభాగం',
    ten: 'Grievance Category'
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
  },
  'pwa.installTitle': {
    en: 'Install MP Portal App',
    te: 'ఎంపీ పోర్టల్ యాప్‌ని ఇన్‌స్టాల్ చేయండి',
    ten: 'Install MP Portal App'
  },
  'pwa.installDesc': {
    en: 'Add this portal to your home screen for quick offline access and updates.',
    te: 'ఆఫ్‌లైన్ యాక్సెస్ మరియు శీఘ్ర అప్‌డేట్స్ కోసం దీనిని మీ హోమ్ స్క్రీన్‌కు చేర్చండి.',
    ten: 'Add to home screen for offline access and fast updates.'
  },
  'pwa.btnInstall': {
    en: 'Install Now',
    te: 'ఇప్పుడే ఇన్‌స్టాల్ చేయండి',
    ten: 'Install Now'
  },
  'pwa.dismiss': {
    en: 'Maybe Later',
    te: 'తర్వాత చూద్దాం',
    ten: 'Maybe Later'
  },
  'pwa.iosInstructions': {
    en: 'Safari Installation Instructions',
    te: 'సఫారీ ఇన్‌స్టాలేషన్ సూచనలు',
    ten: 'Safari Installation Instructions'
  },
  'pwa.iosTapShare': {
    en: '1. Tap the Share button (⎋) in Safari browser',
    te: '1. సఫారీ బ్రౌజర్‌లోని షేర్ బటన్ (⎋) పై క్లిక్ చేయండి',
    ten: '1. Tap the Share button (⎋) in Safari'
  },
  'pwa.iosTapAdd': {
    en: '2. Scroll down and select "Add to Home Screen" (⊞)',
    te: '2. కిందకు స్క్రోల్ చేసి "యాడ్ టు హోమ్ స్క్రీన్" (⊞) ఎంచుకోండి',
    ten: '2. Select "Add to Home Screen" (⊞)'
  },
  'pwa.androidInstructions': {
    en: 'Chrome Installation Instructions',
    te: 'క్రోమ్ ఇన్‌స్టాలేషన్ సూచనలు',
    ten: 'Chrome Installation Instructions'
  },
  'pwa.androidTapMenu': {
    en: '1. Tap the Chrome menu icon (⁝) in the top-right',
    te: '1. పైభాగంలో ఉన్న క్రోమ్ మెనూ ఐకాన్ (⁝) పై క్లిక్ చేయండి',
    ten: '1. Tap the Chrome menu icon (⁝)'
  },
  'pwa.androidTapAdd': {
    en: '2. Select "Add to Home screen" or "Install app"',
    te: '2. "యాడ్ టు హోమ్ స్క్రీన్" లేదా "యాప్ ఇన్‌స్టాల్" ఎంచుకోండి',
    ten: '2. Select "Add to Home screen" or "Install"'
  },
  // FAQ translations
  'faq.sectionTitle': {
    en: 'Frequently Asked Questions',
    te: 'తరచుగా అడిగే ప్రశ్నలు',
    ten: 'Frequently Asked Questions'
  },
  'faq.q1': {
    en: 'Who is Shri Bhashyam Ramakrishna?',
    te: 'శ్రీ భాష్యం రామకృష్ణ ఎవరు?',
    ten: 'Who is Shri Bhashyam Ramakrishna?'
  },
  'faq.a1': {
    en: 'Shri Bhashyam Ramakrishna is a respected educationist, Founder Chairman of Bhashyam Educational Institutions, and a public service leader from Andhra Pradesh who is elected to the Rajya Sabha.',
    te: 'శ్రీ భాష్యం రామకృష్ణ ఆంధ్రప్రదేశ్ నుండి ఎన్నికైన రాజ్యసభ సభ్యులు, ప్రముఖ విద్యావేత్త మరియు భాష్యం విద్యా సంస్థల వ్యవస్థాపక చైర్మన్.',
    ten: 'Shri Bhashyam Ramakrishna is a respected educationist, Founder Chairman of Bhashyam Educational Institutions, and a public service leader from Andhra Pradesh who is elected to the Rajya Sabha.'
  },
  'faq.q2': {
    en: 'Which political party does Shri Bhashyam Ramakrishna belong to?',
    te: 'శ్రీ భాష్యం రామకృష్ణ ఏ రాజకీయ పార్టీకి చెందినవారు?',
    ten: 'Which political party does Shri Bhashyam Ramakrishna belong to?'
  },
  'faq.a2': {
    en: 'He belongs to the Telugu Desam Party (TDP), representing Andhra Pradesh in the Rajya Sabha.',
    te: 'ఆయన తెలుగుదేశం పార్టీ (TDP) కి చెందిన నాయకులు, ఆంధ్రప్రదేశ్ తరఫున రాజ్యసభలో ప్రాతినిధ్యం వహిస్తున్నారు.',
    ten: 'He belongs to the Telugu Desam Party (TDP), representing Andhra Pradesh in the Rajya Sabha.'
  },
  'faq.q3': {
    en: 'How was Shri Bhashyam Ramakrishna elected to the Rajya Sabha?',
    te: 'శ్రీ భాష్యం రామకృష్ణ రాజ్యసభకు ఎలా ఎన్నికయ్యారు?',
    ten: 'How was Shri Bhashyam Ramakrishna elected to the Rajya Sabha?'
  },
  'faq.a3': {
    en: 'He was elected unopposed to the Rajya Sabha from Andhra Pradesh, representing the aspirations of the people.',
    te: 'ఆయన ఆంధ్రప్రదేశ్ నుండి రాజ్యసభకు ఏకగ్రీవంగా ఎన్నికయ్యారు.',
    ten: 'He was elected unopposed to the Rajya Sabha from Andhra Pradesh, representing the aspirations of the people.'
  },
  'faq.q4': {
    en: 'What is his official designation?',
    te: 'ఆయన అధికారిక హోదా ఏమిటి?',
    ten: 'What is his official designation?'
  },
  'faq.a4': {
    en: 'Prior to June 22, 2026, he serves as Rajya Sabha Member-Elect. From June 22, 2026 onwards, he serves as Member of Parliament, Rajya Sabha.',
    te: 'జూన్ 22, 2026కి ముందు ఆయన \'రాజ్యసభ ఎన్నికైన సభ్యులు\'గా వ్యవహరిస్తారు. జూన్ 22, 2026 నుండి ఆయన \'రాజ్యసభ సభ్యులు\'గా పూర్తి బాధ్యతలు స్వీకరిస్తారు.',
    ten: 'Prior to June 22, 2026, he serves as Rajya Sabha Member-Elect. From June 22, 2026 onwards, he serves as Member of Parliament, Rajya Sabha.'
  },
  'faq.q5': {
    en: 'What are his primary public focus areas?',
    te: 'ఆయన ప్రజా సేవలో ఏ రంగాలపై దృష్టి సారిస్తారు?',
    ten: 'What are his primary public focus areas?'
  },
  'faq.a5': {
    en: 'His primary focus areas include promoting quality education, youth development, skill empowerment, rural infrastructure, and addressing public grievances.',
    te: 'ఆయన ప్రధానంగా నాణ్యమైన విద్య, యువత సాధికారత, ఉపాధి నైపుణ్యాల అభివృద్ధి, గ్రామీణ మౌలిక सదుపాయాలు మరియు ప్రజా సమస్యల పరిష్కారంపై దృష్టి సారిస్తారు.',
    ten: 'His primary focus areas include promoting quality education, youth development, skill empowerment, rural infrastructure, and addressing public grievances.'
  },
  'faq.q6': {
    en: 'How can citizens submit grievances or contact his office?',
    te: 'పౌరులు తమ సమస్యలను ఎలా సమర్పించవచ్చు లేదా ఆయన కార్యాలయాన్ని ఎలా సంప్రదించవచ్చు?',
    ten: 'How can citizens submit grievances or contact his office?'
  },
  'faq.a6': {
    en: 'Citizens can submit issues directly through the online Grievance Portal on this website or reach out to the State Camp Office in Guntur and New Delhi office.',
    te: 'ప్రజలు ఈ వెబ్‌సైట్‌లోని ఫిర్యాదుల పోర్టల్ ద్వారా నేరుగా తమ సమస్యలను పంపవచ్చు లేదా గుంటూరు, న్యూఢిల్లీ కార్యాలయాలను సంప్రదించవచ్చు.',
    ten: 'Citizens can submit issues directly through the online Grievance Portal on this website or reach out to the State Camp Office in Guntur and New Delhi office.'
  },
  'faq.q7': {
    en: 'Where is the MP\'s camp office located in Guntur?',
    te: 'గుంటూరులో ఎంపీ గారి క్యాంప్ కార్యాలయం ఎక్కడ ఉంది?',
    ten: 'Camp office location in Guntur'
  },
  'faq.a7': {
    en: 'The State Camp Office is located at Navabharath Nagar 4/3 Line, Guntur - 522006, dedicated to receiving constituent grievances and coordinating state development pushes.',
    te: 'రాష్ట్ర క్యాంప్ కార్యాలయం గుంటూరులోని నవభారత్ నగర్ 4/3 లైన్ నందు కలదు. ఇది పౌరుల ఫిర్యాదులను స్వీకరించడానికి మరియు రాష్ట్ర అభివృద్ధి పనుల సమన్వయానికి కేటాయించబడింది.',
    ten: 'Camp office Guntur, Navabharath Nagar 4/3 Line లో ఉంది.'
  },
  'faq.q8': {
    en: 'What is the residency address of Rajya Sabha member Bhashyam Ramakrishna in New Delhi?',
    te: 'న్యూఢిల్లీలో రాజ్యసభ సభ్యులు భాష్యం రామకృష్ణ గారి అధికారిక నివాస చిరునామా ఏమిటి?',
    ten: 'New Delhi residency address'
  },
  'faq.a8': {
    en: 'The official New Delhi residence is situated at Rajya Sabha Member Flats, New Delhi, serving as the legislative office for national coordination and parliamentary operations.',
    te: 'న్యూఢిల్లీలోని రాజ్యసభ సభ్యుల నివాస సముదాయం నందు ఆయన అధికారిక నివాసం ఉంది. ఇది జాతీయ సమన్వయం మరియు పార్లమెంటరీ కార్యకలాపాల కోసం శాసన కార్యాలయంగా పనిచేస్తుంది.',
    ten: 'New Delhi residence address Rajya Sabha Member Flats లో ఉంది.'
  },
  // DPDP keys
  'dpdp.consent': {
    en: 'I explicitly consent to the collection and safe processing of my name, phone number, and address details under the Digital Personal Data Protection (DPDP) Act 2023 for grievance resolution and communication.',
    te: 'ఫిర్యాదు పరిష్కారం మరియు సంప్రదింపుల కోసం డిజిటల్ వ్యక్తిగత సమాచార రక్షణ చట్టం (DPDP) 2023 ప్రకారం నా పేరు, ఫోన్ నంబర్ మరియు చిరునామా వివరాలను సేకరించి సురక్షితంగా ప్రాసెస్ చేయడానికి నేను స్పష్టమైన సమ్మతిని ఇస్తున్నాను.',
  },
  'dpdp.privacyBadge': {
    en: 'Data Protected: Your submission is encrypted and safeguarded against leaks under Digital Personal Data Protection (DPDP) standards.',
    te: 'సమాచార భద్రత: మీ వివరాలు డిజిటల్ వ్యక్తిగత డేటా రక్షణ (DPDP) ప్రమాణాల ప్రకారం సురక్షితంగా మరియు ఎన్క్రిప్ట్ చేయబడతాయి.',
  },
  // Search keys
  'search.placeholder': {
    en: 'Search press releases, speeches, and FAQs in Telugu or English...',
    te: 'పత్రికా ప్రకటనలు, ప్రసంగాలు మరియు ప్రశ్నలను తెలుగు లేదా ఇంగ్లీషులో శోధించండి...',
  },
  'search.noResults': {
    en: 'No relevant matches found. Try using different keywords.',
    te: 'ఎటువంటి ఫలితాలు లభించలేదు. ఇతర పదాలతో మళ్లీ ప్రయత్నించండి.',
  },
  'search.resultsCount': {
    en: 'Found {count} results',
    te: '{count} ఫలితాలు కనుగొనబడ్డాయి',
  },
  'search.pressType': {
    en: 'Press Release',
    te: 'పత్రికా ప్రకటన',
  },
  'search.speechType': {
    en: 'Parliament Speech',
    te: 'పార్లమెంటరీ ప్రసంగం',
  },
  'search.faqType': {
    en: 'Biography FAQ',
    te: 'జీవిత చరిత్ర ప్రశ్న',
  },
  'search.button': {
    en: 'Search',
    te: 'శోధన',
  },
  // A11y Panel keys
  'a11y.title': {
    en: 'Accessibility Controls',
    te: 'యాక్సెసిబిలిటీ నియంత్రణలు',
  },
  'a11y.textZoom': {
    en: 'Text Size',
    te: 'అక్షరాల పరిమాణం',
  },
  'a11y.grayscale': {
    en: 'Grayscale Mode',
    te: 'గ్రేస్కేల్ మోడ్',
  },
  'a11y.contrast': {
    en: 'High Contrast',
    te: 'అధిక కాంట్రాస్ట్',
  },
  'a11y.dyslexic': {
    en: 'Dyslexia Friendly',
    te: 'డిస్లెక్సియా ఫ్రెండ్లీ',
  },
  'a11y.reset': {
    en: 'Reset Defaults',
    te: 'సాధారణ స్థితికి తెచ్చు',
  },
  'a11y.close': {
    en: 'Close Panel',
    te: 'ప్యానెల్ మూసివేయి',
  },
  'a11y.widgetTooltip': {
    en: 'Accessibility Settings',
    te: 'యాక్సెసిబిలిటీ సెట్టింగ్స్',
  },
  // SEO Meta values
  'meta.home.title': {
    en: 'Shri Bhashyam Ramakrishna | Official Rajya Sabha Portal',
    te: 'శ్రీ భాష్యం రామకృష్ణ | అధికారిక రాజ్యసభ పోర్టల్',
  },
  'meta.home.desc': {
    en: 'Official public portal of Shri Bhashyam Ramakrishna, educationist, Founder Chairman of Bhashyam Educational Institutions, and Rajya Sabha representative from Andhra Pradesh.',
    te: 'శ్రీ భాష్యం రామకృష్ణ అధికారిక ప్రజా సేవా పోర్టల్. విద్యా రంగ అభివృద్ధి, యువత సాధికారత మరియు ప్రజా సమస్యల పరిష్కార వేదిక.',
  },
  'meta.about.title': {
    en: 'Biography & Vision | Shri Bhashyam Ramakrishna',
    te: 'జీవిత చరిత్ర & దూరదృష్టి | శ్రీ భాష్యం రామకృష్ణ',
  },
  'meta.about.desc': {
    en: 'Learn about Bhashyam Ramakrishna\'s journey from Founder Chairman of Bhashyam Educational Institutions to Rajya Sabha representative from Andhra Pradesh.',
    te: 'భాష్యం విద్యా సంస్థల చైర్మన్ నుండి రాజ్యసభ ప్రతినిధి వరకు శ్రీ భాష్యం రామకృష్ణ ప్రజా సేవ ప్రస్థానాన్ని తెలుసుకోండి.',
  },
  'meta.contact.title': {
    en: 'Contact Offices | Rajya Sabha MP Bhashyam Ramakrishna',
    te: 'కార్యాలయాల సంప్రదింపు వివరాలు | శ్రీ భాష్యం రామకృష్ణ',
  },
  'meta.contact.desc': {
    en: 'Contact offices of Shri Bhashyam Ramakrishna in New Delhi and Camp Office in Guntur, Andhra Pradesh. Submit inquiries and policy feedback.',
    te: 'న్యూఢిల్లీ మరియు గుంటూరు క్యాంప్ కార్యాలయాల చిరునామా, ఫోన్ మరియు ఈమెయిల్ వివరాలు. మీ సలహాలు, సూచనలను ఇక్కడ పంపండి.',
  },
  'meta.grievance.title': {
    en: 'Public Grievance Portal | Bhashyam Ramakrishna MP',
    te: 'ప్రజా ఫిర్యాదుల పోర్టల్ | శ్రీ భాష్యం రామకృష్ణ',
  },
  'meta.grievance.desc': {
    en: 'Submit local challenges, community requests, or suggestions directly to Bhashyam Ramakrishna Rajya Sabha office. Track grievance status.',
    te: 'మీ స్థానిక సమస్యలు, సలహాలు మరియు పౌర ఇబ్బందులను నేరుగా సమర్పించండి మరియు మీ టికెట్ స్థితిని ఇక్కడ లైవ్‌లో ట్రాక్ చేయండి.',
  },
  'meta.parliament.title': {
    en: 'Parliamentary Speeches & Updates | Bhashyam Ramakrishna MP',
    te: 'పార్లమెంటరీ ప్రసంగాలు & అప్‌డేట్స్ | శ్రీ భాష్యం రామకృష్ణ',
  },
  'meta.parliament.desc': {
    en: 'Track questions raised, speeches delivered, debates joined, and legislative activity by Bhashyam Ramakrishna in the Rajya Sabha, Parliament of India.',
    te: 'భారత పార్లమెంటు రాజ్యసభలో భాష్యం రామకృష్ణ గారు అడిగిన ప్రశ్నలు, ప్రసంగాలు మరియు శాసనసభ కార్యకలాపాల తాజా వివరాలు.',
  },
  'meta.press.title': {
    en: 'Official Press Releases & Media | Bhashyam Ramakrishna',
    te: 'అధికారిక పత్రికా ప్రకటనలు | శ్రీ భాష్యం రామకృష్ణ',
  },
  'meta.press.desc': {
    en: 'Read latest statements, news coverage, press notes, and media releases issued by the office of Rajya Sabha member Bhashyam Ramakrishna.',
    te: 'భాష్యం రామకృష్ణ గారి కార్యాలయం నుండి విడుదలైన తాజా అధికారిక పత్రికా ప్రకటనలు, పత్రికా నోట్స్ మరియు వార్తల వివరాలు.',
  },
  'meta.daily.title': {
    en: 'Daily Activities & Updates | Bhashyam Ramakrishna MP',
    te: 'రోజువారీ కార్యకలాపాలు & అప్‌డేట్స్ | శ్రీ భాష్యం రామకృష్ణ',
  },
  'meta.daily.desc': {
    en: 'Explore daily work updates, news briefs, and activities of Rajya Sabha MP Bhashyam Ramakrishna.',
    te: 'గౌరవనీయులైన రాజ్యసభ సభ్యులు భాష్యం రామకృష్ణ గారి రోజువారీ పనులు, వార్తా నివేదికలు మరియు ప్రజాసేవ కార్యక్రమాల వివరాలు.',
  },
  'meta.state.title': {
    en: 'Andhra Pradesh Development Sectors | Bhashyam Ramakrishna',
    te: 'ఆంధ్రప్రదేశ్ ప్రాధాన్యత రంగాలు | శ్రీ భాష్యం రామకృష్ణ',
  },
  'meta.state.desc': {
    en: 'Explore key sectors, concerns, and progress vision of Rajya Sabha MP Bhashyam Ramakrishna for the development of Andhra Pradesh.',
    te: 'ఆంధ్రప్రదేశ్ ప్రగతి మరియు అభివృద్ధి కోసం శ్రీ భాష్యం రామకృష్ణ గారి రంగాలు, ఆలోచనలు మరియు ప్రణాళికలు.',
  },
  'meta.development.title': {
    en: 'Public Initiatives & Works | Bhashyam Ramakrishna',
    te: 'ప్రజా అభివృద్ధి పనులు & కార్యక్రమాలు | శ్రీ భాష్యం రామకృష్ణ',
  },
  'meta.development.desc': {
    en: 'Track dynamic progress, ordering, and execution of public welfare initiatives and educational works pushed by Bhashyam Ramakrishna in AP.',
    te: 'శ్రీ భాష్యం రామకృష్ణ ఆధ్వర్యంలో జరుగుతున్న ప్రజా సంక్షేమ మరియు విద్యా అభివృద్ధి పనుల తాజా పురోగతి నివేదిక.',
  },
  'meta.privacy.title': {
    en: 'Privacy Policy | Bhashyam Ramakrishna Portal',
    te: 'గోప్యతా విధానం | శ్రీ భాష్యం రామకృష్ణ పోర్టల్',
  },
  'meta.privacy.desc': {
    en: 'Privacy policy for citizen data and grievance submission protection on the official Bhashyam Ramakrishna portal.',
    te: 'పౌరుల సమాచారం మరియు సమర్పించిన సమస్యల భద్రతకు సంబంధించిన అధికారిక గోప్యతా విధానం.',
  },
  'meta.terms.title': {
    en: 'Terms of Use | Bhashyam Ramakrishna Portal',
    te: 'నిబంధనలు & షరతులు | శ్రీ భాష్యం రామకృష్ణ పోర్టల్',
  },
  'meta.terms.desc': {
    en: 'Terms and conditions for utilizing the official Rajya Sabha Member public portal and submitting grievances.',
    te: 'అధికారిక ప్రజా సేవా పోర్టల్ మరియు ఫిర్యాదుల పోర్టల్ వినియోగానికి సంబంధించిన నిబంధనలు మరియు షరతులు.',
  },
  'meta.accessibility.title': {
    en: 'Accessibility Statement | Bhashyam Ramakrishna Portal',
    te: 'యాక్సెసిబిలిటీ ప్రకటన | శ్రీ భాష్యం రామకృష్ణ పోర్టల్',
  },
  'meta.accessibility.desc': {
    en: 'Accessibility commitment and WCAG standards compliance description for the official Bhashyam Ramakrishna portal.',
    te: 'వెబ్‌సైట్ అందరికీ సులభంగా అందుబాటులో ఉండేలా మేము అనుసరిస్తున్న యాక్సెసిబిలిటీ విధానాలు మరియు ప్రమాణాలు.',
  }
}

// Localized Categories list for Grievances
export const grievanceCategories: Record<string, Record<Language, string> & { ten?: string }> = {
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
