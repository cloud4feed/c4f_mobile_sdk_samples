package com.example.surveysdktestapp.adapters

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.Lifecycle
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.example.surveysdktestapp.fragments.MenWomenFragment

class DashboardPagerAdapter(
    fragmentManager: FragmentManager,
    lifecycle: Lifecycle
) : FragmentStateAdapter(fragmentManager, lifecycle) {
    
    override fun getItemCount(): Int = 2
    
    override fun createFragment(position: Int): Fragment {
        // First tab is Mens (position 0), second is Womens (position 1)
        return MenWomenFragment.newInstance(position == 0)
    }
}