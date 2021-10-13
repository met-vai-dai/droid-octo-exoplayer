package com.example.code.exoplayer.ui

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.code.exoplayer.Constants
import com.example.code.exoplayer.core.ExoplayerAction
import com.example.code.exoplayer.core.ExoplayerLifecycleObserver
import com.example.code.exoplayer.R
import com.example.code.exoplayer.databinding.ActivityExoplayerBinding
import com.google.android.exoplayer2.Player
import com.google.android.exoplayer2.util.MimeTypes
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ExoPlayerFragment : Fragment(), Player.Listener, ExoPlayerContentSelCallback {

    private val binding by lazy(LazyThreadSafetyMode.NONE) {
        ActivityExoplayerBinding.inflate(layoutInflater)
    }

    private lateinit var locationListener: ExoplayerLifecycleObserver

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setOnClickListener()
        initExoplayerListener()
    }

    override fun onClick(url: String, type: String) {
        locationListener.changeTrack(url,type)
    }

    private fun setOnClickListener() {
        binding.selectUrlId.setOnClickListener {
            val dialog = ExoPlayerContentSelFragment()
            dialog.setOnClickListener(this)
            dialog.show(childFragmentManager, null)
        }
    }

    private fun initExoplayerListener() {
        activity?.let{
            locationListener = ExoplayerLifecycleObserver(lifecycle,it) {
                when(it) {
                    is ExoplayerAction.BindExoplayer -> binding.exoplayerView.player = it.simpleExoplayer
                    is ExoplayerAction.ProgressBarVisibility -> handleProgressVisibilityOfPlayer(it.isVisible)
                }
            }
        }
    }

    private fun handleProgressVisibilityOfPlayer(visible: Boolean) {
        if (visible)
            binding.progressBar.visibility = View.VISIBLE
        else
            binding.progressBar.visibility = View.INVISIBLE
    }

}