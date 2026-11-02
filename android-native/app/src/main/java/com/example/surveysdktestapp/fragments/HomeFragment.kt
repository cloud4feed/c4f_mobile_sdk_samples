package com.example.surveysdktestapp.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.view.setPadding
import androidx.fragment.app.Fragment
import com.example.surveysdktestapp.R
import com.c4f.mobileSDK.MobileSDK

class HomeFragment : Fragment() {
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val root = inflater.inflate(R.layout.fragment_home, container, false)

        // Add predefined survey buttons
        addPredefinedButtons(root)
        
        // Add custom button with ID "my_custom_button"
        addCustomButton(root)
        
        // Add test survey buttons
        addTestSurveyButtons(root)
        
        // Add scrollable content
        val contentContainer = root.findViewById<TextView>(R.id.content_container)
        contentContainer.text = generateDummyContent()
        
        return root
    }
    
    private fun addPredefinedButtons(root: View) {
        val surveyContainer = root.findViewById<LinearLayout>(R.id.survey_container)
        
        // Add section title
        val titleView = TextView(requireContext()).apply {
            text = "Predefined Buttons (Auto-detected by SDK):"
            textSize = 16f
            setPadding(0, 16, 0, 8)
        }
        surveyContainer.addView(titleView)
        
        // Add all predefined buttons from SDKConstants
        val predefinedIds = listOf(
            "survey_button",
            "take_survey", 
            "feedback_button",
            "rate_app"
        )
        
        predefinedIds.forEach { buttonId ->
            // Get resource ID dynamically
            val resId = getResourceId(buttonId)
            
            val button = Button(requireContext()).apply {
                text = "Predefined: $buttonId"
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 8)
                }
                
                // Set the ID if it exists, otherwise create a button without ID
                if (resId != 0) {
                    id = resId
                } else {
                    // If ID doesn't exist in resources, we can't test this predefined button
                    text = "$buttonId (ID not in resources)"
                    isEnabled = false
                    alpha = 0.5f
                }
            }
            surveyContainer.addView(button)
        }
    }
    
    private fun addCustomButton(root: View) {
        val surveyContainer = root.findViewById<LinearLayout>(R.id.survey_container)
        
        // Add section title
        val titleView = TextView(requireContext()).apply {
            text = "Custom Button (my_custom_button):"
            textSize = 16f
            setPadding(0, 16, 0, 8)
        }
        surveyContainer.addView(titleView)
        
        // Get resource ID for "my_custom_button"
        val customButtonId = getResourceId("my_custom_button")
        
        // Add the custom button
        val customButton = Button(requireContext()).apply {
            text = if (customButtonId != 0) {
                "Custom: my_custom_button (ID exists)"
            } else {
                "my_custom_button (ID not in resources)"
            }
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, 0, 0, 16)
            }
            
            // Set the ID if it exists
            if (customButtonId != 0) {
                id = customButtonId
            } else {
                isEnabled = false
                alpha = 0.5f
            }
        }
        
        surveyContainer.addView(customButton)
    }
    
    private fun addTestSurveyButtons(root: View) {
        val surveyContainer = root.findViewById<LinearLayout>(R.id.survey_container)
        
        // Add section title
        val titleView = TextView(requireContext()).apply {
            text = "Manual Trigger Tests:"
            textSize = 16f
            setPadding(0, 16, 0, 8)
        }
        surveyContainer.addView(titleView)
        
        // Create a vertical layout for test buttons
        val testContainer = LinearLayout(requireContext()).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }
        surveyContainer.addView(testContainer)
        
        // Add test buttons for different trigger types
        val testButtons = listOf(
            "🎯 Manual Show Survey" to { 
                MobileSDK.getInstance().showSurvey(requireActivity()) 
            },
            "📍 Navigation Trigger (notifications)" to { 
                MobileSDK.getInstance().triggerByNavigation("notifications", requireActivity()) 
            },
            "📱 Tab Change Trigger (womens)" to {
                MobileSDK.getInstance().triggerByTabChange("womens", requireActivity())
            },
            "📜 Scroll Trigger (600px)" to { 
                MobileSDK.getInstance().triggerScrollManual(requireActivity(), 600) 
            },
            "🔄 Trigger Button by ID (survey_button)" to {
                MobileSDK.getInstance().triggerButtonByStringId("survey_button", requireActivity())
            }
        )

        testButtons.forEach { (text, action) ->
            val button = Button(requireContext()).apply {
                this.text = text
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 8)
                }
                setOnClickListener { 
                    action.invoke()
                    // Add some feedback
                    this.isEnabled = false
                    this.alpha = 0.7f
                    this.text = "$text (triggered)"
                    
                    // Re-enable after delay
                    postDelayed({
                        this.isEnabled = true
                        this.alpha = 1.0f
                        this.text = text
                    }, 2000)
                }
            }
            testContainer.addView(button)
        }
    }
    
    /**
     * Get resource ID for button names
     * Returns 0 if ID doesn't exist
     */
    private fun getResourceId(buttonName: String): Int {
        return resources.getIdentifier(buttonName, "id", requireActivity().packageName)
    }
    
    private fun generateDummyContent(): String {
        val builder = StringBuilder()
        builder.append("Welcome to Survey SDK Test App\n\n")
        builder.append("Scroll down to test scroll trigger!\n\n")
        
        // Add lots of content for scrolling
        repeat(50) { index ->
            builder.append("Scroll content line $index\n")
        }
        
        builder.append("\n👇 Keep scrolling for more content...\n\n")
        
        repeat(50) { index ->
            builder.append("More content line ${index + 50}\n")
        }
        
        builder.append("\n🎯 Scroll threshold should trigger at 500px\n")
        builder.append("📊 Current scroll position will be checked\n")
        
        return builder.toString()
    }
}