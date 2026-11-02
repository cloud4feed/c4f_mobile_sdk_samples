package com.example.surveysdktestapp.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.surveysdktestapp.R

class MenWomenFragment : Fragment() {
    
    companion object {
        private const val ARG_IS_MEN = "is_men"
        
        fun newInstance(isMen: Boolean): MenWomenFragment {
            return MenWomenFragment().apply {
                arguments = Bundle().apply {
                    putBoolean(ARG_IS_MEN, isMen)
                }
            }
        }
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val root = inflater.inflate(R.layout.fragment_men_women, container, false)
        val textView = root.findViewById<TextView>(R.id.text_content)
        
        val isMen = arguments?.getBoolean(ARG_IS_MEN) ?: true
        val category = if (isMen) "Mens" else "Womens"
        
        textView.text = "$category Section\n\n" +
                "This tab demonstrates how your survey SDK can be triggered from different sections of the app."
        
        // Setup button click listeners
        setupButtons(root, category)
        
        return root
    }
    
    private fun setupButtons(root: View, category: String) {
        val buttons = listOf(
            root.findViewById<Button>(R.id.btn_test1),
            root.findViewById<Button>(R.id.btn_test2),
            root.findViewById<Button>(R.id.btn_test3)
        )
        
        buttons.forEachIndexed { index, button ->
            button.text = "$category Option ${index + 1}"
            button.setOnClickListener {
                showToast("$category Option ${index + 1} clicked")
            }
        }
    }
    
    private fun showToast(message: String) {
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
    }
}