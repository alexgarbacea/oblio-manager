interface PageContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      {children}
    </div>
  );
}
