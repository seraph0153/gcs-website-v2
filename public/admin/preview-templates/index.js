// Hero Block
const HeroPreview = ({ title, subtitle, image, button_text, button_link, align }) => {
    const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center justify-center';
    const containerAlign = align === 'left' ? 'mx-0' : 'mx-auto';

    return (
        <section className={`relative h-[600px] flex ${alignClass} text-white bg-gray-900`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-gray-900 opacity-90"></div>
                {image && <img src={image} className="w-full h-full object-cover opacity-50" />}
            </div>
            <div className={`relative z-10 max-w-7xl w-full px-4 ${align === 'center' ? 'mx-auto' : ''}`}>
                <div className={`max-w-3xl ${containerAlign}`}>
                    <h1 className="text-5xl font-bold mb-6">{title}</h1>
                    <p className="text-xl mb-10 text-gray-200">{subtitle}</p>
                    {button_text && (
                        <div className={`flex ${align === 'left' ? 'justify-start' : 'justify-center'}`}>
                            <a className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full">{button_text}</a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// Features Block
const FeaturesPreview = ({ items, bg_color }) => {
    const bgClass = bg_color === 'gray' ? 'bg-gray-100' : 'bg-white';
    return (
        <section className={`py-20 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Why GCS?</span>
                    <h2 className="text-3xl font-bold mt-2">그레이스기독학교의 특징</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(items || []).map((item, i) => (
                        <div key={i} className="p-8 bg-white rounded-xl shadow-md text-center border border-gray-100">
                            <div className="text-5xl mb-6 text-blue-600">{item.icon || 'star'}</div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Content Block
const ContentPreview = ({ title, body, image, image_pos, bg_color }) => {
    const bgClass = bg_color === 'gray' ? 'bg-gray-100' : 'bg-white';
    const direction = image_pos === 'left' ? 'md:flex-row-reverse' : '';

    return (
        <section className={`py-20 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className={`flex flex-col md:flex-row gap-12 items-center ${direction}`}>
                    <div className="flex-1">
                        {title && <h2 className="text-3xl font-bold mb-6 text-gray-900">{title}</h2>}
                        <div className="prose prose-lg text-gray-600">
                            {/* Note: Netlify CMS 'widgetFor' returns a react element, but here we just have markdown string */}
                            {body}
                        </div>
                    </div>
                    {image && (
                        <div className="flex-1 w-full">
                            <img src={image} className="rounded-xl shadow-lg w-full h-[400px] object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// News Block (Mock)
const NewsPreview = ({ title, bg_color }) => {
    const bgClass = bg_color === 'gray' ? 'bg-gray-100' : 'bg-white';
    return (
        <section className={`py-20 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Update</span>
                        <h2 className="text-3xl font-bold mt-2">{title}</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">Mock News Image</div>
                            <div className="p-6">
                                <div className="text-gray-400 text-sm mb-2">2026-02-05</div>
                                <h3 className="text-xl font-bold mb-3">학교 소식 예시 제목입니다 {i}</h3>
                                <p className="text-gray-600 text-sm">이것은 미리보기용 가짜 데이터입니다. 실제 사이트에서는 최신 글이 보입니다.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Main Page Preview
const MainPagePreview = ({ entry }) => {
    const data = entry.getIn(['data']).toJS();
    if (!data.sections) return <div>Loading Sections...</div>;

    return (
        <div className="font-sans antialiased text-gray-900">
            {data.sections.map((section, index) => {
                switch (section.type) {
                    case 'hero': return <HeroPreview key={index} {...section} />;
                    case 'features': return <FeaturesPreview key={index} {...section} />;
                    case 'content': return <ContentBlock {...section} />; // Typo in component name usage? No, function name.
                    // Wait, I defined ContentPreview, not ContentBlock. Fixing below.
                    case 'news': return <NewsPreview key={index} {...section} />;
                    default: return <div key={index} className="p-4 bg-red-100">Unknown block: {section.type}</div>;
                }
            })}
        </div>
    );
};

// Correct ContentPreview usage inside switch
const MainPagePreviewFixed = ({ entry }) => {
    const data = entry.getIn(['data']).toJS();
    if (!data.sections) return <div>Add sections to preview content...</div>;

    return (
        <div className="font-sans antialiased text-gray-900 bg-white">
            {data.sections.map((section, index) => {
                switch (section.type) {
                    case 'hero': return <HeroPreview key={index} {...section} />;
                    case 'features': return <FeaturesPreview key={index} {...section} />;
                    case 'content': return <ContentPreview key={index} {...section} />;
                    case 'news': return <NewsPreview key={index} {...section} />;
                    default: return null;
                }
            })}
        </div>
    );
}

CMS.registerPreviewTemplate('main_layout', MainPagePreviewFixed);
