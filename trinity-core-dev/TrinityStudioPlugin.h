/**
 * TrinityStudioPlugin.h
 * 
 * SKELETON IMPLEMENTATION - MVP Version
 * 
 * This is a minimal header for the Trinity Studio plugin that enables
 * runtime reporting and AI-assisted development for TrinityCore.
 * 
 * Security Note: This is a skeleton. Production implementation should use
 * secure authentication and encryption for all DevHub communications.
 */

#ifndef TRINITY_STUDIO_PLUGIN_H
#define TRINITY_STUDIO_PLUGIN_H

#include <string>
#include <cstdint>

namespace TrinityStudio {

/**
 * Main plugin class for Trinity Studio integration
 * Handles communication with DevHub API for runtime reporting and AI suggestions
 */
class TrinityStudioPlugin {
public:
    TrinityStudioPlugin();
    ~TrinityStudioPlugin();

    /**
     * Register the plugin with TrinityCore
     * Called during server initialization
     * @return true if registration successful
     */
    bool OnStudioRegister();

    /**
     * Report an unknown/unhandled packet to DevHub for analysis
     * @param packetHex Hexadecimal string representation of the packet
     */
    void ReportUnknownPacket(const std::string& packetHex);

    /**
     * Apply an AI-suggested patch to a file
     * @param filePath Path to the file to be patched
     * @param patch Patch content in unified diff format
     * @return true if patch applied successfully
     */
    bool ApplySuggestedPatch(const std::string& filePath, const std::string& patch);

    /**
     * Request a snapshot of current server state for debugging
     * @return JSON string containing server snapshot data
     */
    std::string RequestServerSnapshot();

    /**
     * Get plugin instance
     */
    static TrinityStudioPlugin* GetInstance();

private:
    // DevHub API endpoint (should be configurable via environment variable)
    std::string devhubApiUrl_;
    
    // Plugin enabled flag
    bool enabled_;

    // Singleton instance
    static TrinityStudioPlugin* instance_;
};

} // namespace TrinityStudio

/**
 * Factory function to create plugin instance
 * Called by TrinityCore plugin loader
 */
extern "C" TrinityStudio::TrinityStudioPlugin* CreateTrinityStudioPlugin();

#endif // TRINITY_STUDIO_PLUGIN_H
