package com.tvlive.ui.screens

import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import androidx.compose.material3.ExperimentalMaterial3Api
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

data class Channel(val name: String, val url: String)

val playlistUrl = "https://iptv-org.github.io/iptv/index.m3u"

val favoriteChannels = listOf(
    Channel("CCTV-1 综合", "https://ldncctvwbcdbd.a.bdydns.com/ldncctvwbcd/cdrmldcctv1_1/index.m3u8?BR=td"),
    Channel("CCTV-2 财经", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv2_1/index.m3u8?BR=td&region=beijing"),
    Channel("CCTV-4 中文国际", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv4_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-6 电影", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv6_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-7 国防军事", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv7_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-8 电视剧", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv8_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-9 纪录", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv9_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-10 科教", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv10_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-11 戏曲", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv11_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-12 社会与法", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv12_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-13 新闻", "https://ldncctvwbcdbd.a.bdydns.com/ldncctvwbcd/cdrmldcctv13_1/index.m3u8?BR=td"),
    Channel("CCTV-14 少儿", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv14_1/index.m3u8?BR=hd&region=beijing"),
    Channel("CCTV-15 音乐", "https://ldocctvwbcdks.v.kcdnvip.com/ldocctvwbcd/cdrmldcctv15_1/index.m3u8?BR=hd&region=beijing")
)

val categories = listOf("全部", "央视", "港台", "新闻", "体育", "电影")

suspend fun fetchChannels(): List<Channel> = withContext(Dispatchers.IO) {
    try {
        val url = URL(playlistUrl)
        val conn = url.openConnection() as HttpURLConnection
        conn.requestMethod = "GET"
        conn.connectTimeout = 15000
        conn.readTimeout = 15000
        
        val reader = BufferedReader(InputStreamReader(conn.inputStream))
        val lines = reader.readLines()
        reader.close()
        
        val channels = mutableListOf<Channel>()
        var currentName = ""
        
        for (line in lines) {
            when {
                line.startsWith("#EXTINF:") -> {
                    val nameMatch = Regex("""tvg-name="([^"]*)"""").find(line)
                    currentName = nameMatch?.groupValues?.get(1) ?: run {
                        val commaIndex = line.indexOf(',')
                        if (commaIndex > 0) line.substring(commaIndex + 1).trim() else ""
                    }
                }
                line.isNotEmpty() && !line.startsWith("#") -> {
                    if (currentName.isNotEmpty() && (line.startsWith("http://") || line.startsWith("https://"))) {
                        channels.add(Channel(currentName, line))
                    }
                    currentName = ""
                }
            }
        }
        
        // 合并常用频道（去重）
        favoriteChannels.forEach { fc ->
            if (channels.none { it.name == fc.name }) {
                channels.add(0, fc)
            }
        }
        
        channels.take(200)
    } catch (e: Exception) {
        e.printStackTrace()
        favoriteChannels
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen() {
    var selectedChannel by remember { mutableStateOf<Channel?>(null) }
    var channels by remember { mutableStateOf<List<Channel>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var selectedCategory by remember { mutableStateOf("全部") }

    LaunchedEffect(Unit) {
        isLoading = true
        channels = fetchChannels()
        if (channels.isEmpty()) {
            channels = favoriteChannels
        }
        isLoading = false
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // 顶部标题
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(Color(0xFF0f3460), Color(0xFF533483))
                    )
                )
                .padding(vertical = 20.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    "📺 TV Live",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "全球网络电视",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White.copy(alpha = 0.7f)
                )
            }
        }

        // 分类标签
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF1a1a2e))
                .padding(vertical = 8.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(categories) { cat ->
                FilterChip(
                    selected = selectedCategory == cat,
                    onClick = { selectedCategory = cat },
                    label = { Text(cat) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = Color(0xFF00d4ff),
                        selectedLabelColor = Color.Black
                    )
                )
            }
        }

        // 频道数
        Text(
            "已加载 ${channels.size} 个频道",
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            color = Color(0xFF00d4ff),
            style = MaterialTheme.typography.bodySmall
        )

        if (selectedChannel != null) {
            VideoPlayer(
                channel = selectedChannel!!,
                onBack = { selectedChannel = null }
            )
        } else {
            if (isLoading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color(0xFF00d4ff))
                }
            } else {
                val filteredChannels = when (selectedCategory) {
                    "全部" -> channels.take(50)
                    "央视" -> channels.filter { it.name.contains("CCTV") }
                    "港台" -> channels.filter { it.name.contains("TVB") || it.name.contains("香港") || it.name.contains("台湾") }
                    "新闻" -> channels.filter { it.name.contains("新闻") || it.name.contains("News") }
                    "体育" -> channels.filter { it.name.contains("体育") || it.name.contains("Sport") }
                    "电影" -> channels.filter { it.name.contains("电影") || it.name.contains("Movie") || it.name.contains("Film") }
                    else -> channels.take(50)
                }
                
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(filteredChannels) { channel ->
                        ChannelItem(
                            channel = channel,
                            onClick = { selectedChannel = channel }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ChannelItem(channel: Channel, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF2a2a4a)
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                channel.name,
                style = MaterialTheme.typography.titleMedium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f)
            )
            Text(
                "▶",
                color = Color(0xFF00d4ff)
            )
        }
    }
}

@Composable
fun VideoPlayer(channel: Channel, onBack: () -> Unit) {
    val context = LocalContext.current
    val exoPlayer = remember {
        ExoPlayer.Builder(context)
            .setRenderersFactory(
                androidx.media3.exoplayer.DefaultRenderersFactory(context).apply {
                    setEnableDecoderFallback(true)
                }
            )
            .build()
            .apply {
                setMediaItem(MediaItem.fromUri(channel.url))
                prepare()
                playWhenReady = true
            }
    }

    DisposableEffect(Unit) {
        onDispose {
            exoPlayer.release()
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.DarkGray)
                .padding(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            TextButton(onClick = onBack) {
                Text("← 返回", color = Color.White)
            }
            Spacer(modifier = Modifier.weight(1f))
            Text(channel.name, color = Color.White)
        }

        AndroidView(
            factory = { ctx ->
                PlayerView(ctx).apply {
                    player = exoPlayer
                    layoutParams = FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                }
            },
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black)
        )
    }
}
