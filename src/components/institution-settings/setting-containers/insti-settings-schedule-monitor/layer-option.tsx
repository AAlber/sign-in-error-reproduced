export default function LayerOption({ layer }) {
  return (
    <div className="flex w-full items-center justify-start gap-3">
      <div className="flex items-center gap-2 font-medium text-contrast">
        {layer.course && layer.course.icon && <span>{layer.course.icon}</span>}
        <span>{layer.name}</span>
      </div>
    </div>
  );
}
