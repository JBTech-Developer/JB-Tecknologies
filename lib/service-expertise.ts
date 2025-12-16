import { Service } from './types';

/**
 * Service-specific expertise content templates
 * These provide detailed, technical information for each service
 */

export interface ServiceExpertise {
  overview: string;
  technicalSpecs: string[];
  useCases: string[];
  benefits: string[];
  installationProcess: string;
  certifications: string[];
  whyChooseUs: string;
}

const serviceExpertiseMap: Record<string, ServiceExpertise> = {
  'voice-data-cabling-installers': {
    overview: 'Cat6 and Cat6A structured cabling form the backbone of modern enterprise networks, supporting Gigabit and 10-Gigabit Ethernet speeds. Our certified technicians install Category 6 and Category 6A twisted-pair copper cabling that meets or exceeds TIA/EIA-568-C.2 standards, ensuring reliable data transmission for voice, video, and data applications.',
    technicalSpecs: [
      'Cat6: Up to 250 MHz bandwidth, supports 10GBASE-T up to 55 meters',
      'Cat6A: Up to 500 MHz bandwidth, supports 10GBASE-T up to 100 meters',
      'TIA/EIA-568-C.2 compliant installation',
      'ANSI/TIA-606-C labeling standards',
      'Cable management with J-hooks, cable trays, and raceways',
      'Punch-down termination to 110 blocks and patch panels'
    ],
    useCases: [
      'Office buildings requiring high-speed LAN connectivity',
      'Data centers needing server-to-switch connections',
      'Educational facilities with classroom networking',
      'Healthcare facilities with medical device connectivity',
      'Retail stores with POS and inventory systems',
      'Warehouses with WMS and barcode scanning systems'
    ],
    benefits: [
      'Future-proof infrastructure supporting next-generation applications',
      'Reduced latency and packet loss for critical business applications',
      'Compliance with building codes and fire safety regulations',
      'Comprehensive warranty coverage on materials and workmanship',
      'Scalable design accommodating future expansion'
    ],
    installationProcess: 'Our installation process begins with a comprehensive site survey and network design. We map out cable pathways, calculate pull distances, and identify optimal locations for telecommunications rooms. During installation, we follow strict cable management practices, maintain proper bend radius (4x cable diameter minimum), and test every connection with Fluke DSX CableAnalyzer to verify TIA performance standards. Post-installation, we provide detailed as-built documentation and certification reports.',
    certifications: [
      'BICSI Registered Communications Distribution Designer (RCDD)',
      'TIA/EIA-568-C Standards Certification',
      'OSHA 30-Hour Construction Safety',
      'Low-Voltage Electrical License',
      'Firestop Installation Certification'
    ],
    whyChooseUs: 'With over 15 years of experience in structured cabling, our team has completed installations in facilities ranging from 1,000 to 500,000 square feet. We maintain a 99.7% first-time certification pass rate and provide lifetime support on all installations. Our technicians are manufacturer-certified by leading cable manufacturers including CommScope, Belden, and General Cable.'
  },
  'fiber-optic-cabling-installation': {
    overview: 'Fiber optic cabling provides the highest bandwidth and longest distance capabilities for network backbones. We install both single-mode (OS2) and multi-mode (OM3/OM4/OM5) fiber optic cables, supporting everything from 1Gbps to 400Gbps applications. Our fiber installations include fusion splicing, connectorization, and comprehensive OTDR testing to ensure optimal signal integrity.',
    technicalSpecs: [
      'Single-mode OS2: 1310nm/1550nm wavelengths, up to 10km+ distances',
      'Multi-mode OM4: 850nm/1300nm, supports 10GBASE-SR up to 400m',
      'Multi-mode OM5: Wideband fiber supporting SWDM4 applications',
      'Fusion splicing with <0.05dB insertion loss',
      'LC, SC, and MPO/MTP connectorization',
      'OTDR testing with full trace documentation'
    ],
    useCases: [
      'Campus networks connecting multiple buildings',
      'Data center interconnects and server farms',
      'Fiber-to-the-desk (FTTD) installations',
      'Security camera systems requiring long-distance runs',
      'Telecommunications carrier extensions',
      'Industrial facilities with EMI interference concerns'
    ],
    benefits: [
      'Immunity to electromagnetic interference (EMI)',
      'Secure data transmission (difficult to tap)',
      'Long-distance capabilities without signal degradation',
      'Future-proof for 100Gbps and 400Gbps applications',
      'Lower latency compared to copper alternatives'
    ],
    installationProcess: 'Fiber optic installation requires specialized equipment and expertise. We begin with a detailed pathway survey, identifying optimal routes while avoiding sharp bends (minimum 20x cable diameter). We use specialized pulling equipment to maintain proper tension limits, then perform fusion splicing in climate-controlled environments. Every fiber is tested with OTDR and power meter to verify insertion loss, return loss, and end-to-end continuity. We provide complete documentation including splice maps and test results.',
    certifications: [
      'BICSI Fiber Optic Installer (FOI)',
      'Fiber Optic Association (FOA) Certified',
      'Fusion Splicing Certification (Fujikura, Corning)',
      'OTDR Testing Certification',
      'OSHA Confined Space Entry'
    ],
    whyChooseUs: 'Our fiber optic team has completed over 500 fiber installations, including 10+ data center projects. We maintain a <0.1dB average splice loss and have never failed a customer acceptance test. Our technicians are certified on all major fusion splicer platforms and maintain manufacturer partnerships with Corning, OFS, and CommScope.'
  },
  'point-to-point-wireless-bridge': {
    overview: 'Point-to-Point (PtP) wireless bridges provide high-speed connectivity between buildings without the cost and complexity of trenching fiber. We deploy enterprise-grade wireless bridges using licensed and unlicensed spectrum, achieving speeds from 100Mbps to 10Gbps over distances up to 50+ kilometers. Our installations include path surveys, frequency coordination, and link optimization for maximum reliability.',
    technicalSpecs: [
      'Unlicensed: 5GHz (802.11ac/ax), 60GHz (802.11ad) for short-range',
      'Licensed: 6GHz, 11GHz, 18GHz, 23GHz bands for long-range',
      'Throughput: 100Mbps to 10Gbps depending on frequency and distance',
      'Range: 500 meters (60GHz) to 50+ kilometers (licensed bands)',
      'Latency: <1ms for most applications',
      'Weather-resistant enclosures with heating/cooling systems'
    ],
    useCases: [
      'Connecting remote buildings on a campus',
      'Temporary construction site connectivity',
      'Disaster recovery and backup links',
      'Surveillance camera backhaul',
      'ISP last-mile connectivity',
      'Connecting facilities separated by obstacles (rivers, highways)'
    ],
    benefits: [
      'No trenching or right-of-way permits required',
      'Faster deployment than fiber (days vs. months)',
      'Lower upfront costs for short-distance links',
      'Scalable bandwidth with software upgrades',
      'Redundant path options for critical applications'
    ],
    installationProcess: 'We begin with a comprehensive path survey using specialized tools to verify line-of-sight and identify potential interference sources. We calculate Fresnel zone clearance, account for Earth curvature over long distances, and perform spectrum analysis. During installation, we use precision alignment tools to achieve optimal signal strength, then configure link aggregation, QoS, and security protocols. Post-installation testing includes throughput verification, latency measurement, and failover testing.',
    certifications: [
      'FCC General Radiotelephone Operator License (GROL)',
      'Wireless Network Administrator (CWNA)',
      'Ubiquiti, Cambium, and Siklu Certified Installer',
      'Tower Climbing and Rescue Certification',
      'RF Safety Training (OSHA)'
    ],
    whyChooseUs: 'Our wireless team has deployed over 200 PtP links with a 99.5% uptime average. We specialize in challenging environments including urban canyons, coastal areas with salt spray, and extreme temperature ranges. We maintain partnerships with leading manufacturers including Ubiquiti, Cambium Networks, and Siklu, ensuring access to the latest technology and support.'
  },
  'commercial-wifi-installation': {
    overview: 'Enterprise WiFi networks require careful design to ensure coverage, capacity, and security. We design and install WiFi networks using leading vendors including Cisco, Aruba, Ruckus, and Ubiquiti. Our installations include predictive and post-installation surveys, proper channel planning, and seamless roaming configuration for mobile devices.',
    technicalSpecs: [
      '802.11ax (WiFi 6) and 802.11ac (WiFi 5) support',
      'Dual-band (2.4GHz and 5GHz) and tri-band configurations',
      'MU-MIMO for simultaneous multi-user connections',
      'Beamforming technology for improved range and reliability',
      'Centralized management with cloud or on-premise controllers',
      'WPA3 and 802.1X enterprise authentication'
    ],
    useCases: [
      'Office buildings with high device density',
      'Retail stores with customer WiFi and POS systems',
      'Warehouses with mobile scanning devices',
      'Healthcare facilities with medical device connectivity',
      'Educational institutions with BYOD policies',
      'Hospitality venues requiring guest and staff networks'
    ],
    benefits: [
      'Seamless roaming between access points',
      'Centralized management and monitoring',
      'Guest network isolation for security',
      'Bandwidth management and QoS policies',
      'Analytics and usage reporting'
    ],
    installationProcess: 'We start with a predictive RF survey using Ekahau or AirMagnet to model coverage and identify optimal access point locations. During installation, we mount access points following manufacturer specifications, run Category 6A cabling for Power over Ethernet Plus (PoE+), and configure controller-based or cloud-managed systems. Post-installation, we perform active surveys to verify coverage, test roaming, and optimize channel assignments. We provide network documentation and training for IT staff.',
    certifications: [
      'CWNA (Certified Wireless Network Administrator)',
      'CWAP (Certified Wireless Analysis Professional)',
      'Cisco, Aruba, and Ruckus Certified Installer',
      'Ekahau Site Survey Certified',
      'Network+ and Security+ Certifications'
    ],
    whyChooseUs: 'We have designed and installed WiFi networks in facilities ranging from 5,000 to 2 million square feet. Our team maintains certifications with all major WiFi vendors and uses professional-grade survey tools. We achieve 99%+ coverage in all installations and provide ongoing optimization services to maintain peak performance as usage patterns change.'
  },
  'commercial-cctv-installation': {
    overview: 'IP-based surveillance systems provide high-resolution video monitoring with remote access and intelligent analytics. We install complete CCTV systems including cameras, network video recorders (NVRs), storage solutions, and monitoring software. Our installations support both cloud and on-premise storage, with options for AI-powered analytics including facial recognition, license plate recognition, and motion detection.',
    technicalSpecs: [
      '4K and 8MP IP cameras with H.265 compression',
      'PoE+ powered cameras reducing installation complexity',
      'NVR systems supporting 16 to 256+ channels',
      'Cloud storage options with automatic backup',
      'Mobile app access for remote monitoring',
      'AI analytics: people counting, loitering detection, heat mapping'
    ],
    useCases: [
      'Retail stores for loss prevention and customer analytics',
      'Warehouses for inventory security and workflow monitoring',
      'Office buildings for access control and visitor management',
      'Parking lots and garages for vehicle monitoring',
      'Manufacturing facilities for safety compliance',
      'Healthcare facilities for patient and staff safety'
    ],
    benefits: [
      'Remote monitoring from any device',
      'Intelligent alerts reducing false alarms',
      'Scalable systems accommodating future expansion',
      'Integration with access control and alarm systems',
      'Compliance with privacy regulations (HIPAA, GDPR)'
    ],
    installationProcess: 'We begin with a security assessment to identify coverage gaps and optimal camera placement. We install cameras using proper mounting hardware, run Category 6A cabling for PoE+ power and data, and configure NVR systems with appropriate storage capacity. We set up remote access with secure authentication, configure motion zones and recording schedules, and integrate with existing security systems. Post-installation, we provide training and documentation.',
    certifications: [
      'Axis Certified Professional',
      'Hikvision Certified Installer',
      'Network Video System Designer',
      'Low-Voltage Security License',
      'OSHA 30-Hour Construction Safety'
    ],
    whyChooseUs: 'Our security team has installed over 1,000 cameras across 200+ facilities. We specialize in challenging environments including low-light conditions, extreme temperatures, and high-vibration areas. We maintain partnerships with leading manufacturers and provide 24/7 monitoring integration services. All installations include comprehensive warranties and ongoing support.'
  },
  'access-control-systems': {
    overview: 'Modern access control systems replace traditional keys with electronic credentials including keycards, fobs, and mobile credentials. We install cloud-managed and on-premise access control systems that integrate with video surveillance, visitor management, and alarm systems. Our solutions support multi-site management, time-based access rules, and comprehensive audit trails.',
    technicalSpecs: [
      'Card readers: Proximity, smart card, and biometric options',
      'Cloud-managed and on-premise controllers',
      'Mobile credential support (Bluetooth, NFC)',
      'Integration with video surveillance and alarm systems',
      'Multi-site management from single dashboard',
      'Time-based access rules and visitor management'
    ],
    useCases: [
      'Office buildings requiring secure entry',
      'Multi-tenant facilities with separate access zones',
      'Healthcare facilities with HIPAA compliance requirements',
      'Educational institutions with time-based access',
      'Manufacturing facilities with restricted areas',
      'Retail stores with employee and vendor access control'
    ],
    benefits: [
      'Eliminate key management and rekeying costs',
      'Real-time access monitoring and alerts',
      'Comprehensive audit trails for compliance',
      'Remote access management and credential provisioning',
      'Integration with HR systems for automated onboarding/offboarding'
    ],
    installationProcess: 'We begin with a security assessment to identify access points and determine credential requirements. We install card readers, electric strikes, and magnetic locks, then run low-voltage cabling to centralized controllers. We configure access rules, set up user credentials, and integrate with existing systems. Post-installation, we provide training and ongoing support.',
    certifications: [
      'Low-Voltage Security License',
      'Access Control System Designer',
      'Biometric System Installation',
      'OSHA 30-Hour Construction Safety',
      'Network Security Certification'
    ],
    whyChooseUs: 'We have installed access control systems in over 300 facilities, from small offices to multi-building campuses. Our team maintains certifications with leading manufacturers including HID, ASSA ABLOY, and LenelS2. We specialize in complex integrations and provide 24/7 support for critical access systems.'
  },
  'cellular-das-installation': {
    overview: 'Distributed Antenna Systems (DAS) boost cellular signals inside buildings where carrier coverage is weak. We design and install both passive and active DAS systems that support all major carriers (Verizon, AT&T, T-Mobile, Sprint). Our installations include signal testing, antenna placement optimization, and carrier coordination for optimal coverage.',
    technicalSpecs: [
      'Multi-carrier support (Verizon, AT&T, T-Mobile, Sprint)',
      'Passive DAS for small to medium buildings',
      'Active DAS with fiber backhaul for large facilities',
      'Frequency bands: 700MHz, 850MHz, 1900MHz, 2100MHz, 2500MHz',
      'Bi-directional amplifiers and signal boosters',
      'Carrier-approved equipment and installation'
    ],
    useCases: [
      'Office buildings with poor indoor coverage',
      'Hospitals requiring reliable communication for staff',
      'Stadiums and arenas with high user density',
      'Underground facilities and parking garages',
      'Manufacturing facilities with metal structures blocking signals',
      'Hotels and convention centers requiring guest connectivity'
    ],
    benefits: [
      'Improved call quality and reduced dropped calls',
      'Faster data speeds for mobile devices',
      'Support for emergency communications (FirstNet, First Responder networks)',
      'Carrier-approved installations ensuring compliance',
      'Scalable systems accommodating future carrier additions'
    ],
    installationProcess: 'We begin with comprehensive signal testing to identify coverage gaps. We design antenna placement to ensure optimal coverage while avoiding interference. We install antennas, run coaxial or fiber cabling, and install signal amplifiers and controllers. We coordinate with carriers for signal source connections and perform post-installation testing to verify coverage. All installations include carrier approval and certification.',
    certifications: [
      'FCC General Radiotelephone Operator License (GROL)',
      'DAS System Designer Certification',
      'Carrier-Specific Installation Training',
      'RF Safety Training (OSHA)',
      'Tower Climbing and Rescue Certification'
    ],
    whyChooseUs: 'Our DAS team has completed installations in facilities ranging from 50,000 to 2 million square feet. We maintain carrier partnerships and have a 100% carrier approval rate. Our installations consistently achieve 95%+ coverage and support all major carriers with seamless handoff between networks.'
  },
  'fire-alarm-system-installers': {
    overview: 'Commercial fire alarm systems are critical life safety systems required by building codes. We design and install addressable fire alarm systems that meet NFPA 72 standards and local building codes. Our systems include smoke detectors, heat detectors, pull stations, notification appliances, and integration with sprinkler systems and HVAC controls.',
    technicalSpecs: [
      'Addressable fire alarm panels (Simplex, Notifier, EST)',
      'Smoke detectors: Photoelectric, ionization, and air sampling',
      'Heat detectors: Fixed temperature and rate-of-rise',
      'Notification appliances: Horns, strobes, speakers',
      'Integration with sprinkler systems and HVAC',
      'NFPA 72 compliant design and installation'
    ],
    useCases: [
      'Office buildings requiring code compliance',
      'Healthcare facilities with life safety requirements',
      'Educational institutions with occupancy requirements',
      'Manufacturing facilities with special hazard detection',
      'Retail stores and shopping centers',
      'Multi-family residential buildings'
    ],
    benefits: [
      'Code compliance ensuring building occupancy permits',
      'Early fire detection reducing property damage',
      'Integration with building systems for automatic response',
      'Comprehensive testing and inspection services',
      '24/7 monitoring and maintenance support'
    ],
    installationProcess: 'We begin with a fire safety assessment and code review to determine system requirements. We design the system layout, select appropriate detection devices, and install fire alarm panels and devices following NFPA 72 standards. We run fire-rated cabling, install notification appliances, and integrate with building systems. Post-installation, we perform comprehensive testing and coordinate with local fire departments for final inspection.',
    certifications: [
      'NICET Level III Fire Alarm Systems',
      'NFPA 72 Certified',
      'Fire Alarm System Designer',
      'Low-Voltage Fire Alarm License',
      'OSHA 30-Hour Construction Safety'
    ],
    whyChooseUs: 'Our fire alarm team includes NICET-certified technicians with over 20 years of experience. We have installed systems in facilities ranging from small offices to 1 million+ square foot buildings. We maintain a 100% first-time inspection pass rate and provide ongoing testing and maintenance services to ensure code compliance.'
  }
};

/**
 * Get expertise content for a service
 */
export function getServiceExpertise(service: Service): ServiceExpertise | null {
  return serviceExpertiseMap[service.slug] || null;
}

/**
 * Generate comprehensive service content with expertise
 */
export function generateExpertServiceContent(
  service: Service,
  city: { name: string; stateAbbr: string; county?: string; zipCodes?: string[] }
): {
  overview: string;
  technicalSpecs: string[];
  useCases: string[];
  benefits: string[];
  installationProcess: string;
  certifications: string[];
  whyChooseUs: string;
} {
  const expertise = getServiceExpertise(service);
  
  if (expertise) {
    // Customize with city information
    return {
      ...expertise,
      overview: expertise.overview.replace(/{City}/g, city.name),
      whyChooseUs: expertise.whyChooseUs.replace(/{City}/g, city.name)
    };
  }

  // Fallback for services without specific expertise content
  return {
    overview: `${service.service_name} is a critical component of modern business infrastructure. Our certified technicians provide professional installation and maintenance services for businesses throughout ${city.name}, ${city.stateAbbr}.`,
    technicalSpecs: [
      'Industry-standard installation practices',
      'Manufacturer-certified equipment',
      'Comprehensive testing and certification',
      'Code-compliant installation'
    ],
    useCases: [
      `Office buildings in ${city.name}`,
      'Commercial facilities',
      'Industrial applications',
      'Retail environments'
    ],
    benefits: [
      'Professional installation',
      'Ongoing support and maintenance',
      'Warranty coverage',
      'Scalable solutions'
    ],
    installationProcess: `Our installation process begins with a comprehensive site survey to assess your ${city.name} facility's requirements. We design a custom solution, install equipment following manufacturer specifications, and perform thorough testing to ensure optimal performance.`,
    certifications: [
      'Industry certifications',
      'Manufacturer training',
      'OSHA safety certification',
      'Low-voltage licensing'
    ],
    whyChooseUs: `With years of experience serving ${city.name} businesses, our team brings expertise and reliability to every project. We maintain certifications with leading manufacturers and provide comprehensive support throughout the installation and beyond.`
  };
}

