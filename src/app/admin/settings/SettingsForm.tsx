'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Image from 'next/image';

// Define the types for the data passed to this component
type SiteSetting = {
  content_key: string;
  content_value: string | null;
};

type SettingsFormProps = {
  settings: SiteSetting[];
  updateSettingsAction: (formData: FormData) => Promise<void>;
  updateLogoAction: (formData: FormData) => Promise<void>;
};

export default function SettingsForm({ settings, updateSettingsAction, updateLogoAction }: SettingsFormProps) {
  // Find the initial values from the props
  const settingsMap = new Map(settings.map(s => [s.content_key, s.content_value]));
  const initialOrder = settingsMap.get('section_order')?.split(',') || ['packages', 'moments', 'testimonials'];

  const [sections, setSections] = useState(initialOrder);
  const [fileName, setFileName] = useState('');

  // This is a workaround for a hydration issue with the drag-and-drop library
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const logoUrl = settingsMap.get('logo_url') || '';

  return (
    <div className="space-y-12">
      {/* Logo Form */}
      <form action={updateLogoAction} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Site Logo</h2>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <Image 
              src={logoUrl} 
              alt="Current logo" 
              width={64}
              height={64}
              className="h-16 w-16 object-contain bg-gray-200 p-2 rounded" 
            />
          ) : (
            <div className="h-16 w-16 bg-gray-200 p-2 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">No logo</span>
            </div>
          )}
          <div className="flex-grow">
            <label htmlFor="logo-upload" className="cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300">
              Choose File
            </label>
            <input id="logo-upload" type="file" name="logo" accept="image/*" className="hidden" onChange={handleFileChange} />
            <span className="ml-4 text-gray-500">{fileName || 'No file chosen'}</span>
          </div>
          <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">Upload</button>
        </div>
      </form>

      {/* Contact Info Form */}
      <form action={updateSettingsAction} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Homepage & Contact Info</h2>
        <div className="space-y-4">
          {/* Hero Title & Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
            <input 
              name="hero_title" 
              type="text"
              defaultValue={settingsMap.get('hero_title') || ''} 
              className="w-full mt-1 p-2 border rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <input 
              name="hero_subtitle" 
              type="text"
              defaultValue={settingsMap.get('hero_subtitle') || ''} 
              className="w-full mt-1 p-2 border rounded" 
            />
          </div>

          {/* Contact Info Fields */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Contact Page Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input 
                name="contact_address" 
                type="text"
                defaultValue={settingsMap.get('contact_address') || ''} 
                className="w-full mt-1 p-2 border rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="contact_email" 
                defaultValue={settingsMap.get('contact_email') || ''} 
                className="w-full mt-1 p-2 border rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="contact_phone" 
                defaultValue={settingsMap.get('contact_phone') || ''} 
                className="w-full mt-1 p-2 border rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input 
                type="tel" 
                name="whatsapp_number" 
                defaultValue={settingsMap.get('whatsapp_number') || ''} 
                className="w-full mt-1 p-2 border rounded" 
              />
              <p className="text-xs text-gray-500 mt-1">Use international format without &apos;+&apos;, e.g., 6281234567890</p>
            </div>
          </div>
        </div>
        <button type="submit" className="mt-6 px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600">Save Settings</button>
      </form>

      {/* Homepage Section Order Form */}
      <form action={updateSettingsAction} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Homepage Content</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
            <input 
              name="hero_title" 
              type="text"
              defaultValue={settingsMap.get('hero_title') || ''} 
              className="w-full mt-1 p-2 border rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <input 
              name="hero_subtitle" 
              type="text"
              defaultValue={settingsMap.get('hero_subtitle') || ''} 
              className="w-full mt-1 p-2 border rounded" 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Homepage Section Order</label>
            {isClient && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {sections.map((section, index) => (
                        <Draggable key={section} draggableId={section} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-3 bg-gray-100 rounded-md shadow-sm flex items-center gap-3"
                            >
                              <span className="text-gray-400">☰</span>
                              <span className="capitalize">{section}</span>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            )}
            <input type="hidden" name="section_order" value={sections.join(',')} />
          </div>
        </div>
        <button type="submit" className="mt-6 px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600">Save Settings</button>
      </form>
    </div>
  );
}