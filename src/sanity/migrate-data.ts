import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// Simple manual .env parser to avoid external dependencies
try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
} catch (e) {
  // Ignore errors
}

const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error('ERROR: SANITY_WRITE_TOKEN is missing in your environment/dotenv variables.')
  console.log('\nTo get a write token:')
  console.log('1. Go to https://www.sanity.io/manage')
  console.log('2. Select your project: cf3wvwse')
  console.log('3. Navigate to API -> Tokens')
  console.log('4. Add a new token with "Write" permissions')
  console.log('5. Save it in your .env file as: SANITY_WRITE_TOKEN="your_token_here"\n')
  process.exit(1)
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cf3wvwse'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-11'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false
})

async function uploadImage(imagePath: string, retries = 5, delay = 2000) {
  const absolutePath = path.resolve(imagePath)
  if (!fs.existsSync(absolutePath)) {
    console.error(`Image file not found: ${absolutePath}`)
    return null
  }
  const filename = path.basename(absolutePath)
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Uploading asset: ${filename} (Attempt ${attempt}/${retries})...`)
      const fileStream = fs.createReadStream(absolutePath)
      const asset = await client.assets.upload('image', fileStream, {
        filename: filename
      })
      console.log(`Asset uploaded successfully: ${asset._id}`)
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed for ${filename}:`, error.message || error)
      if (attempt === retries) {
        throw error
      }
      const currentDelay = delay * Math.pow(2, attempt - 1)
      console.log(`Waiting ${currentDelay}ms before retrying...`)
      await new Promise(resolve => setTimeout(resolve, currentDelay))
    }
  }
  return null
}

async function run() {
  console.log('Starting migration to Sanity.io...')
  console.log(`Project: ${projectId} | Dataset: ${dataset}\n`)

  // 1. Site Settings
  console.log('Uploading Site Settings singleton...')
  const siteSettingsDoc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    candidateName: {
      en: 'Bhashyam Rama Krishna',
      te: 'భాష్యం రామకృష్ణ',
      ten: 'Bhashyam Rama Krishna'
    },
    roleBadge: {
      en: 'Member of Parliament (Rajya Sabha)',
      te: 'రాజ్యసభ సభ్యులు',
      ten: 'Member of Parliament (Rajya Sabha)'
    },
    tagline: {
      en: 'A Visionary Educationist | A Committed Public Leader | A Voice for AP',
      te: 'దూరదృష్టి గల విద్యావేత్త | ప్రజా సేవకుడు | ఆంధ్రప్రదేశ్ బలమైన గొంతుక',
      ten: 'A Visionary Educationist | Public Leader | AP Voice'
    },
    partyName: {
      en: 'Telugu Desam Party (TDP)',
      te: 'తెలుగుదేశం పార్టీ (TDP)',
      ten: 'Telugu Desam Party (TDP)'
    },
    stateRepresented: {
      en: 'Andhra Pradesh',
      te: 'ఆంధ్రప్రదేశ్',
      ten: 'Andhra Pradesh'
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/ramakrishnabhashyam/',
      youtube: 'https://www.youtube.com/@ramakrishnabhashyam',
      twitter: 'https://x.com/bhashyambrk',
      facebook: 'https://www.facebook.com/ramakrishnabhashyam'
    },
    delhiOffice: {
      address: {
        en: '12, Rajya Sabha Members Residences, New Delhi - 110001',
        te: '12, రాజ్యసభ సభ్యుల నివాసాలు, న్యూఢిల్లీ - 110001',
        ten: '12, Rajya Sabha Members Residences, New Delhi - 110001'
      },
      phone: '+91 11 2301 XXXX',
      email: 'delhi.office@bhashyamramakrishna.in'
    },
    stateOffice: {
      address: {
        en: 'Navabharath Nagar 4/3 Line, Guntur - 522006',
        te: 'నవభారత్ నగర్ 4/3 లైన్, గుంటూరు - 522006',
        ten: 'Navabharath Nagar 4/3 Line, Guntur - 522006'
      },
      phone: '+91 99081 22239 / 40',
      email: 'ramakrishna.bhashyammp@gmail.com'
    },
    introVideoUrl: 'https://www.youtube.com/watch?v=EMgeoUKZJQ4',
    introVideoTitle: {
      en: 'Featured Video',
      te: 'ఫీచర్ చేసిన వీడియో',
      ten: 'Featured Video'
    },
    showIntroVideo: true,
    customEmbedCode: '',
    showCustomEmbed: false
  }
  await client.createOrReplace(siteSettingsDoc)
  console.log('Site Settings updated!\n')

  // 2. About Page Info
  console.log('Uploading About Page singleton...')
  const aboutPageDoc = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: {
      en: 'Bhashyam Rama Krishna',
      te: 'భాష్యం రామకృష్ణ',
      ten: 'Bhashyam Rama Krishna'
    },
    subtitle: {
      en: 'A Visionary Educationist | A Committed Public Leader | A Voice for AP',
      te: 'దూరదృష్టి గల విద్యావేత్త | ప్రజా సేవకుడు | ఆంధ్రప్రదేశ్ బలమైన గొంతుక',
      ten: 'A Visionary Educationist | Public Leader | AP Voice'
    },
    badgeText: {
      en: 'Member of Parliament (Rajya Sabha)',
      te: 'రాజ్యసభ సభ్యులు',
      ten: 'Member of Parliament (Rajya Sabha)'
    },
    profileShortName: {
      en: 'B. Rama Krishna',
      te: 'బి. రామకృష్ణ',
      ten: 'B. Rama Krishna'
    },
    bioParagraph1: {
      en: 'Bhashyam Rama Krishna is a respected educationist, institution builder, and public service leader from Andhra Pradesh. With decades of dedicated work in the field of education, he has played a significant role in shaping the academic journey of thousands of students through Bhashyam Educational Institutions.',
      te: 'భాష్యం రామకృష్ణ ఆంధ్రప్రదేశ్ నుండి గౌరవనీయ విద్యావేత్త, సంస్థల నిర్మాత మరియు ప్రజా సేవకుడు. విద్యా రంగంలో దశాబ్దాల అంకితమైన సేవతో, ఆయన భాష్యం విద్యా సంస్థల ద్వారా వేలాది మంది విద్యార్థుల విద్యా ప్రయాణాన్ని తీర్చిదిద్దడంలో కీలక పాత్ర పోషించారు.',
      ten: 'Bhashyam Rama Krishna is a respected educationist, institution builder, and public service leader. Education sector లో decades పాటు work చేసి, Bhashyam Educational Institutions ద్వారా thousands of students career ని shape చేశారు.'
    },
    bioParagraph2: {
      en: 'Known for his disciplined approach, service-oriented mindset, and strong commitment to youth development, Bhashyam Rama Krishna has built a reputation as a leader who believes that education is the foundation for social progress. His work has always focused on empowering students, supporting families, and contributing to the growth of society through quality education and value-based learning.',
      te: 'క్రమశిక్షణ, సేవానిరతి మరియు యువత అభివృద్ధిపై బలమైన నిబద్ధతకు పేరుగాంచిన భాష్యం రామకృష్ణ, విద్య అనేది సామాజిక పురోగతికి పునాది అని నమ్మే నాయకుడిగా గుర్తింపు పొందారు. ఆయన సేవలు ఎల్లప్పుడూ విద్యార్థుల సాధికారత, కుటుంబాల మద్దతు మరియు విలువలతో కూడిన నాణ్యమైన విద్య ద్వారా సమాజ అభివృద్ధిపై కేంద్రీకృతమై ఉన్నాయి.',
      ten: 'Disciplined approach, service mindset, and youth development కి నిబద్ధత ఉన్న leader గా పేరు తెచ్చుకున్నారు. Education అనేది social progress కి foundation అని నమ్ముతారు. Quality education and values ద్వారా students ని empower చెయ్యడమే target.'
    },
    eduTitle: {
      en: 'Founder Chairman of Bhashyam Educational Institutions',
      te: 'భాష్యం విద్యా సంస్థల వ్యవస్థాపక చైర్మన్',
      ten: 'Founder Chairman of Bhashyam Educational Institutions'
    },
    eduContent: {
      en: 'Under Bhashyam Rama Krishna\'s leadership, the Bhashyam group has grown into one of the well-known educational networks in Andhra Pradesh and Telangana. His vision has always been to make quality education accessible, structured, and result-oriented. His belief is simple and powerful: when students are guided with the right education, values, and confidence, they can build a better future for themselves, their families, and the nation.',
      te: 'భాష్యం రామకృష్ణ నాయకత్వంలో, భాష్యం విద్యా సంస్థలు ఆంధ్రప్రదేశ్ మరియు తెలంగాణలలో ప్రముఖ విద్యా నెట్‌వర్క్‌లలో ఒకటిగా విస్తరించాయి. నాణ్యమైన విద్యను అందుబాటులో ఉంచడం, క్రమబద్ధంగా మరియు ఫలితాల ఆధారితంగా అందించడమే ఆయన ప్రధాన లక్ష్యం. విద్యార్థులకు సరైన జ్ఞానం, విలువలు, ఆత్మవిశ్వాసం అందిస్తే వారు దేశ భవిష్యత్తును మార్చగలరని ఆయన నమ్ముతారు.',
      ten: 'Bhashyam group of institutions ని AP & Telangana లో top educational network గా నిలబెట్టారు. Quality education ని accessible, structured అండ్ result-oriented గా మార్చడమే target. Right guidance and values తో students super future బిల్డ్ చేస్తారని నమ్ముతారు.'
    },
    publicTitle: {
      en: 'Public Service Journey',
      te: 'ప్రజా సేవ ప్రయాణం',
      ten: 'Public Service Journey'
    },
    publicContent: {
      en: 'Beyond education, Bhashyam Rama Krishna has remained closely connected with public service and social development. His journey reflects a strong commitment to people, especially students, youth, parents, teachers, and communities that seek better opportunities. His public service approach is rooted in listening to people, understanding their challenges, and working towards practical solutions. As a Rajya Sabha candidate from Andhra Pradesh nominated by the Telugu Desam Party (TDP), Bhashyam Rama Krishna represents a leadership profile built on education, discipline, development, and service.',
      te: 'విద్యతో పాటు, భాష్యం రామకృష్ణ గారు ప్రజాసేవ మరియు సామాజిక అభివృద్ధి కార్యక్రమాలలో నిరంతరం చురుగ్గా పాల్గొంటున్నారు. ప్రజలకు, ముఖ్యంగా విద్యార్థులు, యువత మరియు ఉపాధ్యాయులకు మెరుగైన అవకాశాలు కల్పించడంలో ఆయన నిబద్ధత స్పష్టంగా కనిపిస్తుంది. ప్రజల సమస్యలను ఆలకించి, ఆచరణాత్మక పరిష్కారాలు కనుగొనడమే ఆయన సేవా విధానం. తెలుగుదేశం పార్టీ (TDP) తరఫున రాజ్యసభ అభ్యర్థిగా ఎంపికైన ఆయన, క్రమశిక్షణ, అభివృద్ధి, విద్యతో కూడిన నాయకత్వానికి నిదర్శనం.',
      ten: 'Education తో పాటు, Bhashyam Rama Krishna గారు public service లో active గా ఉన్నారు. Students, youth, and parents కి opportunities కల్పించడానికి work చేస్తున్నారు. People challenges కి practical solutions తేవడమే strategy. TDP Rajya Sabha leader గా dynamic గా నిలబడ్డారు.'
    },
    quoteText: {
      en: 'Education has the power to change lives, strengthen families, and build the future of our society. My journey has always been guided by the belief that service to people is the highest responsibility. My team and I remain committed to working for the progress of Andhra Pradesh, the empowerment of youth, and the development of our nation.',
      te: 'విద్యకు జీవితాలను మార్చే, కుటుంబాలను బలోపేతం చేసే మరియు సమాజ భవిష్యత్తును నిర్మించే శక్తి ఉంది. ప్రజా సేవయే పరమావధి అనే నమ్మకంతో నా ప్రయాణం సాగింది. ఆంధ్రప్రదేశ్ అభివృద్ధి కోసం, యువత సాధికారత కోసం మరియు దేశ ప్రగతి కోసం నా బృందం మరియు నేను నిరంతరం శ్రమిస్తాము.',
      ten: 'Education has the power to change lives, strengthen families, and build the future. Service to people అనేది top responsibility. AP progress కి అండ్ youth empowerment కి నిరంతరం శ్రమిస్తాము.'
    },
    quoteAuthor: {
      en: 'Bhashyam Rama Krishna',
      te: 'భాష్యం రామకృష్ణ',
      ten: 'Bhashyam Rama Krishna'
    },
    summaryContent: {
      en: 'Bhashyam Rama Krishna is an educationist, Founder Chairman of Bhashyam Educational Institutions, and a public service leader from Andhra Pradesh. With decades of contribution to education and social development, he continues to work with a vision to empower youth, support families, and contribute to the progress of society. His journey from education to public service reflects his commitment to creating meaningful change and serving people with dedication, discipline, and responsibility.',
      te: 'భాష్యం రామకృష్ణ విద్యావేత్త, విద్యా సంస్థల వ్యవస్థాపక చైర్మన్ మరియు సామాజిక నాయకుడు. దశాబ్దాలుగా విద్య మరియు సమాజ అభివృద్ధికి కృషి చేస్తూ, యువతకు అవకాశాలు కల్పించడమే ధ్యేయంగా పనిచేస్తున్నారు. విద్యారంగం నుండి ప్రజా సేవ వైపు సాగిన ఆయన ప్రయాణం క్రమశిక్షణ, బాధ్యతతో కూడిన నిబద్ధతను తెలియజేస్తుంది.',
      ten: 'Bhashyam Rama Krishna గారు educationist, Founder Chairman, and public service leader. Decades of contribution తో youth ని empower చెయ్యడమే vision. Education to public service journey represents dedication, discipline, and responsibility.'
    },
    focusAreas: [
      { en: 'Quality education for all sections of society', te: 'సమాజంలోని అన్ని వర్గాలకు నాణ్యమైన విద్య', ten: 'Quality education for all sections of society' },
      { en: 'Youth empowerment and skill development', te: 'యువత సాధికారత మరియు నైపుణ్యాభివృద్ధి', ten: 'Youth empowerment and skill development' },
      { en: 'Employment-oriented learning', te: 'ఉపాధి ఆధారిత అభ్యాసం', ten: 'Employment-oriented learning' },
      { en: 'Support for students and families', te: 'విద్యార్థులు మరియు కుటుంబాలకు మద్దతు', ten: 'Support for students and families' },
      { en: 'Strengthening public institutions', te: 'ప్రభుత్వ సంస్థల బలోపేతం', ten: 'Strengthening public institutions' },
      { en: 'Rural and urban development', te: 'గ్రామీణ మరియు పట్టణ అభివృద్ధి', ten: 'Rural and urban development' }
    ].map(area => ({ ...area, _type: 'localeString' })),
    values: [
      {
        name: { en: 'Discipline', te: 'క్రమశిక్షణ', ten: 'Discipline' },
        desc: { en: 'The baseline for all successful educational and social institutions.', te: 'అన్ని విజయవంతమైన విద్యా మరియు సామాజిక సంస్థల పునాది.', ten: 'Successful systems కి base-line.' }
      },
      {
        name: { en: 'Education', te: 'విద్య', ten: 'Education' },
        desc: { en: 'The core pillar of public progress and individual empowerment.', te: 'ప్రజా పురోగతి మరియు వ్యక్తిగత సాధికారత యొక్క ప్రధాన స్తంభం.', ten: 'Progress and empowerment core pillar.' }
      },
      {
        name: { en: 'Service', te: 'సేవ', ten: 'Service' },
        desc: { en: 'The highest responsibility of public and political leadership.', te: 'ప్రజా మరియు రాజకీయ నాయకత్వం యొక్క అత్యున్నత బాధ్యత.', ten: 'Public leadership top priority.' }
      },
      {
        name: { en: 'Integrity', te: 'నిజాయితీ', ten: 'Integrity' },
        desc: { en: 'A transparent commitment to honest governance and representation.', te: 'నిజాయితీతో కూడిన పరిపాలన మరియు ప్రాతినిధ్యం పట్ల పారదర్శక నిబద్ధత.', ten: 'Honest governance and representation కి transparent commitment.' }
      },
      {
        name: { en: 'Social Progress', te: 'సామాజిక పురోగతి', ten: 'Social Progress' },
        desc: { en: 'Driving inclusive and long-term socio-economic growth.', te: 'సమ్మిళిత మరియు దీర్ఘకాలిక సామాజిక-ఆర్థిక వృద్ధిని నడపడం.', ten: 'Inclusive and long-term socio-economic growth ని నడపడం.' }
      }
    ]
  }
  await client.createOrReplace(aboutPageDoc)
  console.log('About Page settings updated!\n')

  // 3. Parliamentary Updates
  console.log('Uploading Parliamentary Updates...')
  const updatesList = [
    {
      _id: 'parl-update-1',
      _type: 'parliamentaryUpdate',
      title: {
        en: 'Debate on Digital Infrastructure Expansion in Rural Areas',
        te: 'గ్రామీణ ప్రాంతాలలో డిజిటల్ మౌలిక సదుపాయాల విస్తరణపై చర్చ',
        ten: 'Debate on Rural Digital Infrastructure Expansion'
      },
      date: '2026-05-18',
      summary: {
        en: 'Spoke in Rajya Sabha advocating for enhanced public fund allocations to build secondary optic-fiber loops across remote villages.',
        te: 'రిమోట్ గ్రామాల అంతటా సెకండరీ ఆప్టిక్-ఫైబర్ లూప్‌లను నిర్మించడానికి ప్రభుత్వ నిధుల కేటాయింపులను పెంచాలని రాజ్యసభలో వాదించారు.',
        ten: 'Spoke in Rajya Sabha advocating secondary optic-fiber loops across remote villages build చెయ్యాలని.'
      }
    },
    {
      _id: 'parl-update-2',
      _type: 'parliamentaryUpdate',
      title: {
        en: 'Question raised regarding solar irrigation subsidies for farmers',
        te: 'రైతులకు సౌర నీటిపారుదల రాయితీలపై ప్రశ్నించారు',
        ten: 'Question raised on solar irrigation subsidies for farmers'
      },
      date: '2026-05-12',
      summary: {
        en: 'Asked the Ministry of Power for state-level data on subsidy execution speed and support metrics for minor irrigation.',
        te: 'రాయితీ అమలు వేగం మరియు మైనర్ నీటిపారుదల కోసం మద్దతు కొలమానాలపై రాష్ట్ర స్థాయి డేటాను విద్యుత్ మంత్రిత్వ శాఖను అడిగారు.',
        ten: 'Asked Ministry of Power for state-level data on subsidy execution speed and minor irrigation support.'
      }
    }
  ]

  for (const update of updatesList) {
    await client.createOrReplace(update)
    console.log(`Uploaded parliamentary update: ${update.title.en}`)
  }
  console.log('Parliamentary Updates completed!\n')

  // 4. Press Releases (Requires Image Upload)
  console.log('Uploading Press Releases...')
  const pressImage = await uploadImage('public/images/WhatsApp Image 2026-06-06 at 23.32.04.jpeg')

  const newsList: any[] = [
    {
      _id: 'press-release-1',
      _type: 'pressRelease',
      title: {
        en: "Bhashyam Rama Krishna MP Initiates Multi-Village Drinking Water Action Plan",
        te: "భాష్యం రామకృష్ణ ఎంపీ బహుళ గ్రామ తాగునీటి కార్యాచరణ ప్రణాళికను ప్రారంభించారు",
        ten: "Bhashyam Rama Krishna MP Multi-Village Drinking Water Action Plan start చేశారు"
      },
      slug: { _type: 'slug', current: 'bhashyam-ramakrishna-mp-initiates-multi-village-drinking-water-action-plan' },
      publishedAt: '2026-06-05T00:00:00Z',
      excerpt: {
        en: "Following a review with rural engineers, a new pipeline blueprint was approved to bring potable tap water connection access to several drought-prone villages.",
        te: "గ్రామీణ ఇంజనీర్లతో సమీక్షించిన తరువాత, అనేక కరువు పీడిత గ్రామాలకు సురక్షితమైన కుళాయి నీటి కనెక్షన్ సౌకర్యాన్ని తీసుకురావడానికి కొత్త పైప్‌లైన్ బ్లూప్రింట్ ఆమోదించబడింది.",
        ten: "Review with rural engineers తరువాత, pipeline blueprint approve చేశారు to bring potable tap water access to villages."
      },
      mainImage: pressImage
    },
    {
      _id: 'press-release-2',
      _type: 'pressRelease',
      title: {
        en: "Parliamentary Committee reviews digital literacy achievements",
        te: "పార్లమెంటరీ కమిటీ డిజిటల్ అక్షరాస్యత విజయాలను సమీక్షించింది",
        ten: "Parliamentary Committee digital literacy achievements review చేసింది"
      },
      slug: { _type: 'slug', current: 'parliamentary-committee-reviews-digital-literacy-achievements' },
      publishedAt: '2026-05-29T00:00:00Z',
      excerpt: {
        en: "Rajya Sabha MP Bhashyam Rama Krishna joined the delegation to verify rural center resources and digital training progress.",
        te: "గ్రామీణ కేంద్ర వనరులు మరియు డిజిటల్ శిక్షణ పురోగతిని ధృవీకరించడానికి రాజ్యసభ ఎంపీ భాష్యం రామకృష్ణ ప్రతినిధి బృందంలో చేరారు.",
        ten: "Rajya Sabha MP Bhashyam Rama Krishna delegation లో join అయ్యారు to verify rural center resources and digital training progress."
      }
    }
  ]

  for (const newsItem of newsList) {
    await client.createOrReplace(newsItem)
    console.log(`Uploaded press release: ${newsItem.title.en}`)
  }
  console.log('Press Releases completed!\n')

  // 5. Gallery (Requires Image Uploads)
  console.log('Uploading Gallery items...')
  const galImg1 = await uploadImage('public/images/WhatsApp Image 2026-06-06 at 23.32.03.jpeg')
  const galImg2 = await uploadImage('public/images/WhatsApp Image 2026-06-06 at 23.32.03 (1).jpeg')
  const galImg3 = await uploadImage('public/images/WhatsApp Image 2026-06-06 at 23.32.04 (1).jpeg')
  const galImg4 = await uploadImage('public/images/WhatsApp Image 2026-06-06 at 14.20.21.jpeg')

  const galleryList = [
    {
      _id: 'gallery-img-1',
      _type: 'gallery',
      title: { en: 'Road Widening Inspections', te: 'రోడ్డు విస్తరణ పనుల పరిశీలన', ten: 'Road Widening Inspections' },
      caption: {
        en: "MP Bhashyam Rama Krishna reviewing regional highway connectivity projects and local transport updates.",
        te: "ఎంపీ భాష్యం రామకృష్ణ ప్రాంతీయ రహదారి కనెక్టివిటీ ప్రాజెక్టులు మరియు స్థానిక రవాణా నవీకరణలను సమీక్షిస్తున్నారు.",
        ten: "MP Bhashyam Rama Krishna regional highway connectivity projects and local transport updates review చేస్తున్నారు."
      },
      date: '2026-06-02',
      image: galImg1
    },
    {
      _id: 'gallery-img-2',
      _type: 'gallery',
      title: { en: 'Constituent Grievance Hearing', te: 'ప్రజా సమస్యల విచారణ', ten: 'Constituent Grievance Hearing' },
      caption: {
        en: "Listening to public feedback on public health infrastructure during local interactive town halls.",
        te: "స్థానిక ఇంటరాక్టివ్ టౌన్ హాల్స్ సమయంలో ప్రజారోగ్య మౌలిక సదుపాయాలపై ప్రజల అభిప్రాయాలను వినడం.",
        ten: "Interactive town halls లో public health infrastructure మీద public feedback ని వింటున్నారు."
      },
      date: '2026-05-28',
      image: galImg2
    },
    {
      _id: 'gallery-img-3',
      _type: 'gallery',
      title: { en: 'Water Pipeline Project Site', te: 'నీటి పైప్‌లైన్ ప్రాజెక్ట్ సైట్ పనుల పరిశీలన', ten: 'Water Pipeline Project Site' },
      caption: {
        en: "Inspecting storage wells and clean drinking water pipeline construction progress.",
        te: "నిల్వ బావులు మరియు శుభ్రమైన తాగునీటి పైప్‌లైన్ నిర్మాణ పురోగతిని తనిఖీ చేస్తున్నారు.",
        ten: "Storage wells and clean drinking water pipeline construction progress inspect చేస్తున్నారు."
      },
      date: '2026-05-15',
      image: galImg3
    },
    {
      _id: 'gallery-img-4',
      _type: 'gallery',
      title: { en: 'Bhashyam Kireeti', te: 'భాష్యం కిరీటి పర్యటన', ten: 'Bhashyam Kireeti Visit' },
      caption: {
        en: "MP Bhashyam Rama Krishna wishes from Bhashyam Kireeti.",
        te: "భాష్యం కిరీటి పర్యటనలో శుభాకాంక్షలు తెలుపుతున్న ఎంపీ భాష్యం రామకృష్ణ.",
        ten: "MP Bhashyam Rama Krishna wishes from Bhashyam Kireeti."
      },
      date: '2026-06-07',
      image: galImg4
    }
  ]

  for (const galItem of galleryList) {
    await client.createOrReplace(galItem)
    console.log(`Uploaded gallery item: ${galItem.title.en}`)
  }
  console.log('Gallery upload completed!\n')

  // 6. State Focus Sectors
  console.log('Uploading State Focus Sectors...')
  const sectorsList = [
    {
      _id: 'sector-education',
      _type: 'stateSector',
      title: { en: 'Education', te: 'విద్య', ten: 'Education' },
      short: {
        en: 'Modernizing primary schools and promoting digital labs in high schools.',
        te: 'ప్రాథమిక పాఠశాలలను ఆధునీకరించడం మరియు ఉన్నత పాఠశాలల్లో డిజిటల్ ల్యాబ్‌లను ప్రోత్సహించడం.',
        ten: 'Primary schools modernize cheyyadam and high schools lo digital labs promote cheyyadam.'
      },
      iconName: 'BookOpen',
      vision: {
        en: 'Establishing smart classrooms in rural public schools, enhancing vocational and skill-oriented secondary courses, and expanding college fellowship funds.',
        te: 'గ్రామీణ ప్రభుత్వ పాఠశాలల్లో స్మార్ట్ క్లాస్‌రూమ్‌లను ఏర్పాటు చేయడం, వృత్తి విద్యా మరియు నైపుణ్యాభివృద్ధి కోర్సులను పెంచడం, మరియు కాలేజీ ఫెలోషిప్ నిధులను విస్తరించడం.',
        ten: 'Rural public schools lo smart classrooms establish cheyyadam, vocational/skill courses enhance cheyyadam and college fellowship funds expand cheyyadam.'
      },
      concerns: [
        {
          en: 'Digital divide in remote rural government schools.',
          te: 'సుదూర గ్రామీణ ప్రభుత్వ పాఠశాలల్లో డిజిటల్ విభజన.',
          ten: 'Remote rural government schools lo digital divide.'
        },
        {
          en: 'Need for updated market-aligned curriculum in polytechnic colleges.',
          te: 'పాలిటెక్నిక్ కాలేజీలలో మార్కెట్ అవసరాలకు తగిన పాఠ్యప్రణాళిక అవసరం.',
          ten: 'Polytechnic colleges lo updated market-aligned curriculum rawali.'
        }
      ].map((item, idx) => ({ ...item, _key: `concern-${idx}`, _type: 'localeString' })),
      order: 1
    },
    {
      _id: 'sector-healthcare',
      _type: 'stateSector',
      title: { en: 'Healthcare', te: 'ఆరోగ్యం', ten: 'Healthcare' },
      short: {
        en: 'Supporting primary medical centers and state health facilities.',
        te: 'ప్రాథమిక వైద్య కేంద్రాలు మరియు రాష్ట్ర ఆరోగ్య సౌకర్యాలకు మద్దతు ఇవ్వడం.',
        ten: 'Primary medical centers and state health facilities support cheyyadam.'
      },
      iconName: 'HeartPulse',
      vision: {
        en: 'Advocating for central grants to build state-of-the-art trauma centers, increasing funding for community clinics, and improving drinking water sanitation to prevent local water-borne illnesses.',
        te: 'అత్యాధునిక ట్రామా సెంటర్లను నిర్మించడానికి కేంద్ర గ్రాంట్ల కోసం వాదించడం, కమ్యూనిటీ క్లినిక్‌లకు నిధులను పెంచడం, మరియు నీటి ద్వారా వచ్చే వ్యాధులను నివారించడానికి తాగునీటి పరిశుభ్రతను మెరుగుపరచడం.',
        ten: 'Trauma centers setup ki central grants advocate cheyyadam, community clinics funding penchadam, and drinking water sanitation improve cheyyadam.'
      },
      concerns: [
        {
          en: 'Shortage of specialist doctors in taluk and block level clinics.',
          te: 'తాలూకా మరియు బ్లాక్ స్థాయి క్లినిక్‌లలో నిపుణులైన వైద్యుల కొరత.',
          ten: 'Taluk and block level clinics lo specialist doctors shortage.'
        },
        {
          en: 'Clean drinking water access in arid zones.',
          te: 'ఎండిపోయిన ప్రాంతాలలో శుభ్రమైన తాగునీటి లభ్యత.',
          ten: 'Arid zones lo clean drinking water access.'
        }
      ].map((item, idx) => ({ ...item, _key: `concern-${idx}`, _type: 'localeString' })),
      order: 2
    },
    {
      _id: 'sector-agriculture',
      _type: 'stateSector',
      title: { en: 'Agriculture', te: 'వ్యవసాయం', ten: 'Agriculture' },
      short: {
        en: 'Expanding solar irrigation, cold storage facilities, and fair crop subsidies.',
        te: 'సౌర నీటిపారుదల, కోల్డ్ స్టోరేజ్ సౌకర్యాలు మరియు సరసమైన పంట రాయితీలను విస్తరించడం.',
        ten: 'Solar irrigation, cold storage facilities and fair crop subsidies expand cheyyadam.'
      },
      iconName: 'Sprout',
      vision: {
        en: 'Encouraging minor irrigation projects, solar-powered pump distribution, setting up food processing units close to farming fields, and ensuring prompt settlement of crop insurance claims.',
        te: 'మైనర్ నీటిపారుదల ప్రాజెక్టులు, సౌరశక్తితో నడిచే పంపుల పంపిణీని ప్రోత్సహించడం, వ్యవసాయ క్షేత్రాలకు సమీపంలో ఫుడ్ ప్రాసెసింగ్ యూనిట్లను ఏర్పాటు చేయడం మరియు పంట బీమా క్లెయిమ్‌లను వెంటనే పరిష్కరించడం.',
        ten: 'Minor irrigation projects solar pumps list encourage cheyyadam, field complex block elements deploy and crop insurance settlement fast trackers configure.'
      },
      concerns: [
        {
          en: 'Erratic monsoon rains and lack of storage facilities leading to waste.',
          te: 'రుతుపవనాల అనిశ్చితి మరియు నిల్వ సౌకర్యాలు లేకపోవడం వల్ల పంట వృథా కావడం.',
          ten: 'Monsoon failures and storage gaps leading to crop waste.'
        },
        {
          en: 'Inadequate market access for minor forest produce cultivators.',
          te: 'చిన్న అటవీ ఉత్పత్తుల సాగుదారులకు తగిన మార్కెట్ సౌకర్యం లేకపోవడం.',
          ten: 'Minor forest produce cultivators ki market access points low gundadam.'
        }
      ].map((item, idx) => ({ ...item, _key: `concern-${idx}`, _type: 'localeString' })),
      order: 3
    },
    {
      _id: 'sector-infrastructure',
      _type: 'stateSector',
      title: { en: 'Infrastructure', te: 'మౌలిక సదుపాయాలు', ten: 'Infrastructure' },
      short: {
        en: 'Pushing for highway connectivity and industrial port upgrades.',
        te: 'హైవే కనెక్టివిటీ మరియు పారిశ్రామిక ఓడరేవుల నవీకరణల కోసం కృషి చేయడం.',
        ten: 'Highway connectivity and industrial port upgrades pull cheyyadam.'
      },
      iconName: 'Navigation',
      vision: {
        en: 'Driving policies to construct secondary road links connecting farming villages to national highways, and pushing for faster execution of coastal highway corridors.',
        te: 'వ్యవసాయ గ్రామాలను జాతీయ రహదారులతో అనుసంధానించే ద్వితీయ రోడ్ల నిర్మాణం కోసం విధానాలను రూపొందించడం మరియు తీరప్రాంత హైవే కారిడార్ల వేగవంతమైన అమలుకు ఒత్తిడి తేవడం.',
        ten: 'Rural road links connecting farm areas to highways direct construction and coastal road corridors accelerate cheyyadam.'
      },
      concerns: [
        {
          en: 'Maintenance gaps in rural arterial roads.',
          te: 'గ్రామీణ ప్రధాన రహదారుల నిర్వహణ లోపాలు.',
          ten: 'Rural arterial roads lo maintenance issues.'
        },
        {
          en: 'Congestion near major transport checkposts.',
          te: 'ప్రధాన రవాణా తనిఖీ కేంద్రాల వద్ద ట్రాఫిక్ జామ్‌లు.',
          ten: 'Major transport checkposts daggara traffic congestion.'
        }
      ].map((item, idx) => ({ ...item, _key: `concern-${idx}`, _type: 'localeString' })),
      order: 4
    },
    {
      _id: 'sector-employment',
      _type: 'stateSector',
      title: { en: 'Employment', te: 'ఉపాధి', ten: 'Employment' },
      short: {
        en: 'Promoting vocational skill centers and startup ecosystems.',
        te: 'వృత్తి నైపుణ్య కేంద్రాలు మరియు స్టార్టప్ వ్యవస్థలను ప్రోత్సహించడం.',
        ten: 'Vocational skill centers and startup ecosystems promote cheyyadam.'
      },
      iconName: 'Briefcase',
      vision: {
        en: 'Supporting training institutes that focus on modern skills like green-energy technicians, solar installers, and digital support assistants.',
        te: 'గ్రీన్-ఎనర్జీ టెక్నీషియన్లు, సోలార్ ఇన్‌స్టాలర్లు మరియు డిజిటల్ సపోర్ట్ అసిస్టెంట్లు వంటి ఆధునిక నైపుణ్యాలపై దృష్టి సారించే శిక్షణా సంస్థలకు మద్దతు ఇవ్వడం.',
        ten: 'Green-energy and digital support technicians training center systems build output metrics support.'
      },
      concerns: [
        {
          en: 'Under-employment among educated youth in tier-2 towns.',
          te: 'ద్వితీయ శ్రేణి పట్టణాలలో చదువుకున్న యువతలో నిరుద్యోగం/అల్ప ఉపాధి.',
          ten: 'Tier-2 towns lo educated youth under-employment.'
        },
        {
          en: 'Lack of localized tech incubator spaces.',
          te: 'స్థానిక సాంకేతిక ఇంక్యుబేటర్ స్థలాల కొరత.',
          ten: 'Localized tech incubator spaces availability scale zero low.'
        }
      ].map((item, idx) => ({ ...item, _key: `concern-${idx}`, _type: 'localeString' })),
      order: 5
    },
    {
      _id: 'sector-welfare',
      _type: 'stateSector',
      title: { en: 'Women & Youth Welfare', te: 'మహిళా & యువజన సంక్షేమం', ten: 'Women & Youth Welfare' },
      short: {
        en: 'Empowering self-help groups and youth sports development.',
        te: 'స్వయం సహాయక బృందాలను మరియు యువత క్రీడా అభివృద్ధిని బలోపేతం చేయడం.',
        ten: 'Self-help groups and youth sports development support checkups.'
      },
      iconName: 'Users',
      vision: {
        en: 'Strengthening credit access for rural women self-help networks, expanding scholarship reach, and establishing rural sports development fields.',
        te: 'గ్రామీణ మహిళల స్వయం సహాయక బృందాలకు రుణ సదుపాయాన్ని బలోపేతం చేయడం, స్కాలర్‌షిప్ పరిధిని విస్తరించడం మరియు గ్రామీణ క్రీడా మైదానాలను ఏర్పాటు చేయడం.',
        ten: 'Rural women self-help loops credit access extend checks, scholarships dynamic range scale, and sports grounds structure setup.'
      },
      concerns: [
        {
          en: 'Drop-out rates among female students in higher secondary schools.',
          te: 'ఉన్నత పాఠశాలల్లో బాలికల డ్రాపౌట్ రేట్లు.',
          ten: 'Higher secondary levels checkup female dropout rates scale target.'
        },
        {
          en: 'Underfunded local community centers.',
          te: 'స్థానిక కమ్యూనిటీ కేంద్రాలకు సరిపోని నిధులు.',
          ten: 'Local community centers direct funding gaps.'
        }
      ].map((item, idx) => ({ ...item, _key: `concern-${idx}`, _type: 'localeString' })),
      order: 6
    },
    {
      _id: 'sector-digital',
      _type: 'stateSector',
      title: { en: 'Digital Development', te: 'డిజిటల్ అభివృద్ధి', ten: 'Digital Development' },
      short: {
        en: 'Bringing fiber-grid loops to remote villages.',
        te: 'మారుమూల గ్రామాలకు ఫైబర్-గ్రిడ్ లూప్‌లను తీసుకురావడం.',
        ten: 'Remote villages ki fiber-grid loop layout carry check.'
      },
      iconName: 'Cpu',
      vision: {
        en: 'Ensuring 100% network connectivity in public offices, advocating for cheaper broadband infrastructure, and establishing local common service kiosks.',
        te: 'ప్రభుత్వ కార్యాలయాలలో 100% నెట్‌వర్క్ కనెక్టివిటీని నిర్ధారించడం, చౌకైన బ్రాడ్‌బ్యాండ్ మౌలిక సదుపాయాల కోసం వాదించడం మరియు స్థానిక సేవా కేంద్రాలను ఏర్పాటు చేయడం.',
        ten: 'Public offices 100 percent loop connection targets, low cost broadband layouts, and village kiosks construct.'
      },
      concerns: [
        {
          en: 'Incomplete telecom loop infrastructure in interior villages.',
          te: 'అంతర్గత గ్రామాలలో అసంపూర్ణ టెలికాం లూప్ మౌలిక సదుపాయాలు.',
          ten: 'Interior villages lo telecom loop structures missing.'
        },
        {
          en: 'Digital literacy gaps among senior citizens.',
          te: 'వయోవృద్ధులలో డిజిటల్ అక్షరాస్యత లోపాలు.',
          ten: 'Senior citizens digital literacy programs setup target.'
        }
      ].map((item, idx) => ({ ...item, _key: `concern-${idx}`, _type: 'localeString' })),
      order: 7
    },
    {
      _id: 'sector-environment',
      _type: 'stateSector',
      title: { en: 'Environment', te: 'పర్యావరణం', ten: 'Environment' },
      short: {
        en: 'Promoting afforestation and clean river initiatives.',
        te: 'అడవుల పెంపకం మరియు నదుల శుద్ధీకరణ కార్యక్రమాలను ప్రోత్సహించడం.',
        ten: 'Afforestation and clean river programs list run checks.'
      },
      iconName: 'Leaf',
      vision: {
        en: 'Fostering community-led afforestation, campaigning against industrial river discharges, and boosting renewable solar panel farms.',
        te: 'కమ్యూనిటీ నేతృత్వంలోని అడవుల పెంపకాన్ని ప్రోత్సహించడం, పారిశ్రామిక వ్యర్థాలను నదులలో కలపడానికి వ్యతిరేకంగా ప్రచారం చేయడం మరియు పునరుత్పాదక సోలార్ ప్యానెల్ ఫార్మ్‌లను పెంచడం.',
        ten: 'Community afforestation schemes, industrial waste dump prevention and green energy projects execution.'
      },
      concerns: [
        {
          en: 'Depletion of ground water tables.',
          te: 'భూగర్భ జల మట్టాలు పడిపోవడం.',
          ten: 'Groundwater tables depletion issues.'
        },
        {
          en: 'Plastic accumulation in river basins.',
          te: 'నదీ పరివాహక ప్రాంతాలలో ప్లాస్టిక్ పేరుకుపోవడం.',
          ten: 'River basins lo plastic accumulation control.'
        }
      ].map((item, idx) => ({ ...item, _key: `concern-${idx}`, _type: 'localeString' })),
      order: 8
    }
  ]

  for (const sector of sectorsList) {
    await client.createOrReplace(sector)
    console.log(`Uploaded state focus sector: ${sector.title.en}`)
  }
  console.log('State Focus Sectors completed!\n')

  // 7. Development Projects
  console.log('Uploading Development Projects...')
  const devProjectsList = [
    {
      _id: 'project-water-pipeline',
      _type: 'developmentProject',
      category: { en: 'Infrastructure', te: 'మౌలిక సదుపాయాలు', ten: 'Infrastructure' },
      title: { en: 'Drinking Water Pipeline Project', te: 'తాగునీటి పైప్‌లైన్ ప్రాజెక్ట్', ten: 'Drinking Water Pipeline Project' },
      location: { en: 'Drought-Prone Rural Zones', te: 'కరువు పీడిత గ్రామీణ ప్రాంతాలు', ten: 'Drought-Prone Rural Zones' },
      desc: {
        en: 'Approved pipeline blueprint to bring potable tap water infrastructure to several villages in the dry belt regions.',
        te: 'ఎండిపోయిన ప్రాంతాలలోని అనేక గ్రామాలకు సురక్షితమైన కుళాయి నీటి కనెక్షన్ సౌకర్యం అందించడానికి పైప్‌లైన్ బ్లూప్రింట్ ఆమోదించబడింది.',
        ten: 'Potable tap water lines construction dynamic allocation for drought regions.'
      },
      progress: { en: 'Planning & Mapping Phase', te: 'ప్రణాళిక మరియు మ్యాపింగ్ దశ', ten: 'Planning & Mapping Phase' },
      order: 1
    },
    {
      _id: 'project-solar-irrigation',
      _type: 'developmentProject',
      category: { en: 'Agriculture & Power', te: 'వ్యవసాయం & విద్యుత్', ten: 'Agriculture & Power' },
      title: { en: 'Solar Irrigation Subsidy Advocate', te: 'సోలార్ నీటిపారుదల రాయితీ సిఫార్సు', ten: 'Solar Irrigation Subsidy Advocate' },
      location: { en: 'Agricultural Belts', te: 'వ్యవసాయ ప్రాంతాలు', ten: 'Agricultural Belts' },
      desc: {
        en: 'Led a Rajya Sabha appeal to accelerate solar-pump allocations and state-level minor irrigation fund speed.',
        te: 'సౌర పంపుల కేటాయింపులు మరియు రాష్ట్ర స్థాయి మైనర్ నీటిపారుదల నిధుల విడుదలను వేగవంతం చేయాలని రాజ్యసభలో అభ్యర్థించారు.',
        ten: 'Rajya Sabha request representation to boost solar pumps installation speed.'
      },
      progress: { en: 'Policy Under Discussion', te: 'విధానపరమైన చర్చల దశ', ten: 'Policy Under Discussion' },
      order: 2
    },
    {
      _id: 'project-trauma-center',
      _type: 'developmentProject',
      category: { en: 'Healthcare', te: 'ఆరోగ్యం', ten: 'Healthcare' },
      title: { en: 'Rural Trauma Center Allocations', te: 'గ్రామీణ ట్రామా సెంటర్ కేటాయింపులు', ten: 'Rural Trauma Center Allocations' },
      location: { en: 'Regional Highways', te: 'ప్రాంతీయ రహదారులు', ten: 'Regional Highways' },
      desc: {
        en: 'Secured national health grants for community diagnostic labs and high-quality emergency treatment zones.',
        te: 'కమ్యూనిటీ డయాగ్నస్టిక్ ల్యాబ్‌లు మరియు అధిక నాణ్యత గల అత్యవసర చికిత్స జోన్‌ల కోసం జాతీయ ఆరోగ్య నిధులను మంజూరు చేయించారు.',
        ten: 'National health grants support for diagnostic labs and emergency clinics.'
      },
      progress: { en: 'Fund Sanctioned', te: 'నిధులు మంజూరయ్యాయి', ten: 'Fund Sanctioned' },
      order: 3
    },
    {
      _id: 'project-fiber-grid',
      _type: 'developmentProject',
      category: { en: 'Digital Access', te: 'డిజిటల్ యాక్సెస్', ten: 'Digital Access' },
      title: { en: 'Rural Fiber-Grid Connectivity Loop', te: 'గ్రామీణ ఫైబర్-గ్రిడ్ కనెక్టివిటీ లూప్', ten: 'Rural Fiber-Grid Connectivity Loop' },
      location: { en: 'Secondary Villages', te: 'ద్వితీయ శ్రేణి గ్రామాలు', ten: 'Secondary Villages' },
      desc: {
        en: 'Advocated for optic-fiber secondary loop installations to provide stable wireless network hotspots in village wards.',
        te: 'గ్రామ వార్డులలో స్థిరమైన వైర్‌లెస్ నెట్‌వర్క్ హాట్‌స్పాట్‌లను అందించడానికి ఆప్టిక్-ఫైబర్ సెకండరీ లూప్ ఇన్‌స్టాలేషన్‌ల కోసం వాదించారు.',
        ten: 'Optic fiber loops setup advocacy for interior villages network coverage.'
      },
      progress: { en: 'Under Review', te: 'పరిశీలనలో ఉంది', ten: 'Under Review' },
      order: 4
    }
  ]

  for (const project of devProjectsList) {
    await client.createOrReplace(project)
    console.log(`Uploaded development project: ${project.title.en}`)
  }
  console.log('Development Projects completed!\n')

  console.log('MIGRATION COMPLETE! All public representative data successfully published to Sanity.')
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
