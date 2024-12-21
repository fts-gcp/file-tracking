"use client";

interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline = ({ events }: TimelineProps) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative border-l-4 border-blue-500">
        {events.map((event, index) => (
          <div key={index} className="mb-8 flex items-center">
            <div className="absolute -left-2.5 bg-blue-500 h-5 w-5 rounded-full"></div>
            <div className="ml-6">
              <p className="text-gray-500 text-sm">{event.date}</p>
              <h3 className="text-lg font-bold">{event.title}</h3>
              {event.description && (
                <p className="text-gray-700 mt-1">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
