export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* min-h-120 */}
      <div className="bg-white rounded-2xl m-1 p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
        {children}
      </div>
    </>
  );
}
