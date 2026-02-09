import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
