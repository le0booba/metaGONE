import React from 'react';
import { ImageIcon, VideoIcon } from './icons';

export enum TabType {
  Image = 'image',
  Video = 'video',
}

interface TabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: TabType.Image, name: 'Image Metadata Remover', icon: ImageIcon },
    { id: TabType.Video, name: 'Video Metadata Remover', icon: VideoIcon },
  ];

  return (
    <div>
      <div className="sm:hidden">
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-slate-700 bg-slate-800 text-slate-200 focus:border-sky-500 focus:ring-sky-500"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as TabType)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-sky-400 text-slate-100'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }
                `}
              >
                <tab.icon className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
