import MarketplaceLayout from '../components/layouts/MarketplaceLayout';

const VendorsPage = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await vendorService.getAllVendors({ limit: 50 });
                const data = response.data.data || response.data;
                setVendors(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load vendors', error);
            } finally {
                setLoading(false)
            }
        };
        fetchVendors();
    }, []);

    return (
        <MarketplaceLayout>
            <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Make Your Choice with Our Vendors</h1>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white h-48 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {vendors.map((vendor) => (
                                <Link
                                    key={vendor.id}
                                    to={`/vendors/${vendor.id}`}
                                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center group"
                                >
                                    <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-transparent group-hover:border-green-500 transition-colors">
                                        {vendor.logo_url ? (
                                            <img src={vendor.logo_url} alt={vendor.shop_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 text-2xl font-bold">
                                                {(vendor.shop_name || vendor.name || '?').charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-600">{vendor.shop_name || vendor.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{vendor.address || 'Location N/A'}</p>
                                    <span className="mt-4 inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full group-hover:bg-green-100 group-hover:text-green-800 transition-colors">
                                        Visit Store
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                    {!loading && vendors.length === 0 && (
                        <div className="text-center text-gray-500 py-12">No vendors found.</div>
                    )}
                </div>
            </div>
        </MarketplaceLayout>
    );
};

export default VendorsPage;
