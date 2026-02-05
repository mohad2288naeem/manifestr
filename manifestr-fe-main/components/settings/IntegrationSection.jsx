import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'lucide-react'
import ToggleSwitch from '../forms/ToggleSwitch'

export default function IntegrationSection({ title, subtitle, integrations }) {
  const [integrationStates, setIntegrationStates] = useState(
    integrations.reduce((acc, integration) => {
      acc[integration.id] = {
        connected: integration.connected,
        autoSync: integration.autoSync,
      }
      return acc
    }, {})
  )

  const handleConnect = (id) => {
    setIntegrationStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        connected: !prev[id].connected,
      }
    }))
  }

  const handleAutoSync = (id) => {
    setIntegrationStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        autoSync: !prev[id].autoSync,
      }
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white border border-[#e4e4e7] rounded-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-[20px] font-semibold leading-[30px] text-[#18181b] mb-2">
            {title}
          </h3>
          <p className="text-[14px] leading-[20px] text-[#71717a]">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {integrations.map((integration, index) => {
            const state = integrationStates[integration.id]
            const isConnected = state.connected
            const isAutoSync = state.autoSync

            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${integration.iconColor} rounded-md flex items-center justify-center`}>
                        <integration.icon className="w-5 h-5 text-[#18181b]" />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-semibold leading-[24px] text-[#18181b]">
                          {integration.name}
                        </h4>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[12px] font-medium leading-[18px] ${
                      isConnected
                        ? 'bg-[#d1fae5] text-[#065f46]'
                        : 'bg-[#f4f4f5] text-[#71717a]'
                    }`}>
                      {isConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[14px] leading-[20px] text-[#71717a] mb-6">
                    {integration.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#e4e4e7]">
                    <motion.button
                      onClick={() => handleConnect(integration.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-md px-4 py-2 h-[40px] flex items-center gap-2 text-[14px] font-medium leading-[20px] transition-colors ${
                        isConnected
                          ? 'bg-white border border-[#e4e4e7] text-[#18181b] hover:bg-[#f4f4f5]'
                          : 'bg-[#18181b] text-white hover:opacity-90'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <Link className="w-4 h-4" />
                          Disconnect
                        </>
                      ) : (
                        'Connect'
                      )}
                    </motion.button>

                    {isConnected && (
                      <ToggleSwitch
                        checked={isAutoSync}
                        onChange={() => handleAutoSync(integration.id)}
                        label="Auto-sync"
                        labelPosition="left"
                      />
                    )}
                    {!isConnected && (
                      <ToggleSwitch
                        checked={false}
                        onChange={() => {}}
                        disabled={true}
                        label="Auto-sync"
                        labelPosition="left"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

